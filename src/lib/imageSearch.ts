import { GoogleGenAI, createPartFromBase64 } from "@google/genai";
import type { Product } from "../data/products";

export interface ImageSearchMatch {
  productId: string;
  score: number;
  reason: string;
}

export interface ImageSearchResult {
  preview: string;
  label: string;
  summary: string;
  queryHint: string;
  matches: ImageSearchMatch[];
  provider: "gemini" | "local-fallback";
}

const GEMINI_MODEL = "gemini-2.5-flash";

type ImageTone = {
  dominantColor: string;
  label: string;
  queryHint: string;
  brightness: number;
  saturation: number;
  contrast: number;
};

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Unable to read file"));
    reader.readAsDataURL(file);
  });
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");
  if (normalized.length !== 6) {
    return null;
  }

  const value = Number.parseInt(normalized, 16);
  if (Number.isNaN(value)) {
    return null;
  }

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function colorDistance(a: { r: number; g: number; b: number }, b: { r: number; g: number; b: number }) {
  return Math.sqrt(
    (a.r - b.r) * (a.r - b.r) +
      (a.g - b.g) * (a.g - b.g) +
      (a.b - b.b) * (a.b - b.b)
  );
}

function extractJsonObject(text: string) {
  const trimmed = text.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");

  if (start < 0 || end < start) {
    return null;
  }

  try {
    return JSON.parse(trimmed.slice(start, end + 1)) as unknown;
  } catch {
    return null;
  }
}

function buildProductSummary(product: Product) {
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    subType: product.subType ?? "",
    colorTag: product.colorTag ?? product.colors[0] ?? "",
    colors: product.colors,
    tags: product.tags ?? [],
    price: product.price,
    compareAtPrice: product.compareAtPrice ?? null,
    description: product.description.slice(0, 140),
  };
}

async function analyzeImageTone(dataUrl: string): Promise<ImageTone> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const size = 48;
      const ratio = Math.min(size / img.width, size / img.height, 1);
      canvas.width = Math.max(1, Math.round(img.width * ratio));
      canvas.height = Math.max(1, Math.round(img.height * ratio));

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) {
        reject(new Error("Canvas unavailable"));
        return;
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);

      let red = 0;
      let green = 0;
      let blue = 0;
      let brightnessSum = 0;
      let brightnessSqSum = 0;
      let count = 0;

      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] < 32) {
          continue;
        }

        red += data[i];
        green += data[i + 1];
        blue += data[i + 2];
        const pixelBrightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
        brightnessSum += pixelBrightness;
        brightnessSqSum += pixelBrightness * pixelBrightness;
        count += 1;
      }

      if (!count) {
        reject(new Error("No visible pixels found"));
        return;
      }

      red = Math.round(red / count);
      green = Math.round(green / count);
      blue = Math.round(blue / count);

      const brightness = (red + green + blue) / 3;
      const saturation = (() => {
        const max = Math.max(red, green, blue);
        const min = Math.min(red, green, blue);
        if (max === 0) return 0;
        return ((max - min) / max) * 100;
      })();
      const avgBrightness = brightnessSum / count;
      const variance = Math.max(0, brightnessSqSum / count - avgBrightness * avgBrightness);
      const contrast = Math.sqrt(variance);
      let label = "style match";
      let queryHint = "dress";

      if (brightness < 70 && saturation < 20) {
        label = "dark fashion";
        queryHint = "bags";
      } else if (brightness > 220 && saturation < 18) {
        label = "light fashion";
        queryHint = "casual-clothes";
      } else if (brightness > 210) {
        label = "light fashion";
        queryHint = "shoes";
      } else if (saturation > 42 && red > green && red > blue) {
        label = "warm tones";
        queryHint = "dress";
      } else if (red > green + 18 && red > blue + 18) {
        label = "warm tones";
        queryHint = "dress";
      } else if (green > red + 12 && green >= blue && brightness < 185) {
        label = "earth tones";
        queryHint = "two-piece";
      } else if (red > 150 && green > 120 && blue < 140) {
        label = "warm casual wear";
        queryHint = "casual-clothes";
      } else if (contrast < 22 && brightness < 140) {
        label = "structured accessories";
        queryHint = "bags";
      } else if (blue > red + 12 && blue >= green) {
        label = "cool tones";
        queryHint = "dress";
      }

      resolve({
        dominantColor: `rgb(${red}, ${green}, ${blue})`,
        label,
        queryHint,
        brightness,
        saturation,
        contrast,
      });
    };

    img.onerror = () => reject(new Error("Invalid image"));
    img.src = dataUrl;
  });
}

function rankLocally(tone: ImageTone, catalog: Product[]): ImageSearchMatch[] {
  const toneRgb = tone.dominantColor
    .match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/i)
    ?.slice(1)
    .map((value) => Number(value));

  const imageColor = toneRgb
    ? { r: toneRgb[0], g: toneRgb[1], b: toneRgb[2] }
    : { r: 128, g: 128, b: 128 };

  return catalog
    .map((product) => {
      const productColor = hexToRgb(product.colorTag ?? product.colors[0] ?? "#808080") ?? {
        r: 128,
        g: 128,
        b: 128,
      };

      const categoryKeywords = [
        product.subType ?? "",
        product.category,
        ...(product.tags ?? []),
        product.name,
        product.description.slice(0, 180),
      ]
        .join(" ")
        .toLowerCase();

      let score = 100 - colorDistance(imageColor, productColor) / 4.5;

      if (tone.brightness > 215) {
        score += categoryKeywords.includes("casual-clothes") ? 16 : 0;
      } else if (tone.brightness < 80) {
        score += categoryKeywords.includes("bags") ? 12 : 0;
      }

      if (tone.saturation > 40 && categoryKeywords.includes("dress")) {
        score += 10;
      }

      if (tone.queryHint === "dress" && product.subType === "dress") {
        score += 14;
      } else if (tone.queryHint === "two-piece" && product.subType === "two-piece") {
        score += 14;
      } else if (tone.queryHint === "shoes" && product.category === "shoes") {
        score += 14;
      } else if (tone.queryHint === "bags" && product.category === "bags") {
        score += 14;
      } else if (tone.queryHint === "casual-clothes" && product.category === "casual-clothes") {
        score += 14;
      }

      if (
        tone.queryHint === "casual-clothes" &&
        /(casual|shirt|tee|trouser|denim|linen|lounge|outfit)/i.test(categoryKeywords)
      ) {
        score += 8;
      }

      if (tone.queryHint === "bags" && /(bag|tote|handbag|purse)/i.test(categoryKeywords)) {
        score += 8;
      }

      if (tone.queryHint === "shoes" && /(shoe|heel|sneaker|sandal|pump)/i.test(categoryKeywords)) {
        score += 8;
      }

      if ((product.tags ?? []).some((tag) => tag.toLowerCase().includes("best seller"))) {
        score += 4;
      }

      return {
        productId: product.id,
        score: clampScore(score),
        reason: `Local visual fallback matched ${tone.label.toLowerCase()}.`,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);
}

function mergeMatches(
  localMatches: ImageSearchMatch[],
  geminiMatches: ImageSearchMatch[],
  tone: ImageTone,
  catalog: Product[],
) {
  const catalogById = new Map(catalog.map((product) => [product.id, product]));
  const localRank = new Map(localMatches.map((match, index) => [match.productId, { ...match, index }]));
  const geminiRank = new Map(geminiMatches.map((match, index) => [match.productId, { ...match, index }]));

  const combined = [...new Set([...localRank.keys(), ...geminiRank.keys()])]
    .map((productId) => {
      const product = catalogById.get(productId);
      const local = localRank.get(productId);
      const gemini = geminiRank.get(productId);

      if (!product) {
        return null;
      }

      const localScore = local?.score ?? 0;
      const geminiScore = gemini?.score ?? 0;
      const categoryText = [
        product.category,
        product.subType ?? "",
        product.name,
        ...(product.tags ?? []),
        product.description.slice(0, 120),
      ]
        .join(" ")
        .toLowerCase();

      let score = Math.round(localScore * 0.7 + geminiScore * 0.3);

      if (tone.queryHint === "casual-clothes" && /(casual|shirt|tee|trouser|denim|linen|lounge|outfit)/i.test(categoryText)) {
        score += 6;
      } else if (tone.queryHint === "bags" && /(bag|handbag|tote|purse)/i.test(categoryText)) {
        score += 6;
      } else if (tone.queryHint === "shoes" && /(shoe|heel|sneaker|sandal|pump)/i.test(categoryText)) {
        score += 6;
      } else if (tone.queryHint === "dress" && /(dress|gown|silhouette)/i.test(categoryText)) {
        score += 6;
      } else if (tone.queryHint === "two-piece" && /(two-piece|set|co-ord|coord)/i.test(categoryText)) {
        score += 6;
      }

      return {
        productId,
        score: clampScore(score),
        reason: gemini?.reason ?? local?.reason ?? "Hybrid image ranking.",
      };
    })
    .filter((match): match is ImageSearchMatch => Boolean(match))
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);

  return combined;
}

function normalizeMatches(rawMatches: unknown, catalog: Product[]) {
  if (!Array.isArray(rawMatches)) {
    return [];
  }

  const catalogById = new Map(catalog.map((product) => [product.id, product]));
  const seen = new Set<string>();
  const normalized: ImageSearchMatch[] = [];

  for (const raw of rawMatches) {
    if (!raw || typeof raw !== "object") {
      continue;
    }

    const candidate = raw as {
      productId?: unknown;
      score?: unknown;
      reason?: unknown;
      productName?: unknown;
    };

    const rawId = typeof candidate.productId === "string" ? candidate.productId.trim() : "";
    const rawName = typeof candidate.productName === "string" ? candidate.productName.trim().toLowerCase() : "";
    const product =
      catalogById.get(rawId) ??
      catalog.find((item) => item.name.toLowerCase() === rawName || item.name.toLowerCase().includes(rawName));

    if (!product || seen.has(product.id)) {
      continue;
    }

    const score = typeof candidate.score === "number" ? clampScore(candidate.score) : 70;
    const reason = typeof candidate.reason === "string" && candidate.reason.trim()
      ? candidate.reason.trim()
      : "Model-ranked visual similarity.";

    normalized.push({
      productId: product.id,
      score,
      reason,
    });

    seen.add(product.id);

    if (normalized.length >= 12) {
      break;
    }
  }

  return normalized;
}

async function rankWithGemini(
  file: File,
  dataUrl: string,
  catalog: Product[],
  tone: ImageTone,
): Promise<ImageSearchResult> {
  const apiKey = (import.meta.env.GEMINI_API_KEY as string | undefined)?.trim();
  if (!apiKey) {
    throw new Error("Missing Gemini API key");
  }

  const base64 = dataUrl.includes(",") ? dataUrl.split(",")[1] : "";
  if (!base64) {
    throw new Error("Invalid image data");
  }

  const ai = new GoogleGenAI({ apiKey });
  const prompt = [
    "You are ranking a fashion catalog against an uploaded image.",
    "Use the photo as the primary signal.",
    "Return only valid JSON with these keys:",
    "{ label: string, summary: string, queryHint: string, matches: [{ productId: string, score: number, reason: string }] }",
    "Rules:",
    "- Rank up to 12 products from the provided catalog.",
    "- Scores must be integers from 0 to 100.",
    "- productId must exactly match a catalog item id.",
    "- Prefer silhouette, color, texture, occasion, and visual style over text keywords.",
    "- The uploaded image appears closest to: ",
    `${tone.label} / ${tone.queryHint}`,
    "- Keep the top results tightly related to the image and avoid generic fashion picks.",
    "- Casuals, bags, shoes, dresses, and two-piece sets should only be selected when clearly visually supported.",
    "- Keep reasons concise and specific.",
    "Catalog JSON follows after this prompt.",
  ].join(" ");

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: [
      prompt,
      createPartFromBase64(base64, file.type || "image/jpeg"),
      `Catalog JSON:\n${JSON.stringify(catalog.map(buildProductSummary))}`,
    ],
    config: {
      responseMimeType: "application/json",
      temperature: 0.2,
    },
  });

  const parsed = extractJsonObject(response.text ?? "");
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Gemini returned invalid JSON");
  }

  const candidate = parsed as {
    label?: unknown;
    summary?: unknown;
    queryHint?: unknown;
    matches?: unknown;
  };

  const localMatches = rankLocally(tone, catalog);
  const geminiMatches = normalizeMatches(candidate.matches, catalog);
  const matches = mergeMatches(localMatches, geminiMatches, tone, catalog);
  if (!matches.length) {
    throw new Error("Gemini returned no usable matches");
  }

  return {
    preview: dataUrl,
    label: typeof candidate.label === "string" && candidate.label.trim() ? candidate.label.trim() : "visual match",
    summary:
      typeof candidate.summary === "string" && candidate.summary.trim()
        ? candidate.summary.trim()
        : "Model-ranked image search results.",
    queryHint:
      typeof candidate.queryHint === "string" && candidate.queryHint.trim()
        ? candidate.queryHint.trim()
        : "style",
    matches,
    provider: "gemini",
  };
}

async function buildFallbackResult(dataUrl: string, catalog: Product[]): Promise<ImageSearchResult> {
  let tone: ImageTone;

  try {
    tone = await analyzeImageTone(dataUrl);
  } catch {
    tone = {
      dominantColor: "rgb(128, 128, 128)",
      label: "style match",
      queryHint: "style",
      brightness: 128,
      saturation: 0,
      contrast: 0,
    };
  }

  const matches = rankLocally(tone, catalog);

  return {
    preview: dataUrl,
    label: tone.label,
    summary: "Local visual fallback ranked the catalog by style.",
    queryHint: tone.queryHint,
    matches,
    provider: "local-fallback",
  };
}

export async function searchCatalogByImage(file: File, catalog: Product[]): Promise<ImageSearchResult> {
  const dataUrl = await readFileAsDataUrl(file);
  let tone: ImageTone;

  try {
    tone = await analyzeImageTone(dataUrl);
  } catch {
    tone = {
      dominantColor: "rgb(128, 128, 128)",
      label: "style match",
      queryHint: "style",
      brightness: 128,
      saturation: 0,
      contrast: 0,
    };
  }

  try {
    return await rankWithGemini(file, dataUrl, catalog, tone);
  } catch {
    const matches = rankLocally(tone, catalog);

    return {
      preview: dataUrl,
      label: tone.label,
      summary: "Local visual fallback ranked the catalog by style.",
      queryHint: tone.queryHint,
      matches,
      provider: "local-fallback",
    };
  }
}
