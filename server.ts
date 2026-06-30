import express from "express";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { products } from "./src/data/products";
import { brandLogoUrl, brandName } from "./src/data/brand";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, "dist");
const port = Number(process.env.PORT || 4173);
const appUrl = (process.env.APP_URL || "").trim().replace(/\/$/, "");
const fallbackShareImage = brandLogoUrl;

const app = express();
app.set("trust proxy", true);

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getBaseUrl(req: express.Request) {
  if (appUrl) {
    return appUrl;
  }

  return `${req.protocol}://${req.get("host")}`;
}

function buildMetaTags(req: express.Request, productId?: string) {
  const baseUrl = getBaseUrl(req);
  const product = productId ? products.find((entry) => entry.id === productId) : undefined;
  const shareUrl = product ? `${baseUrl}/product/${product.id}?share=1` : baseUrl;

  const title = product ? `${product.name} | ${brandName}` : brandName;
  const description = product
    ? product.description
    : "Royal Prince Fashion storefront with curated products, checkout, and shareable product previews.";
  const image = product?.images[0] ?? fallbackShareImage;
  const url = product ? shareUrl : baseUrl;

  return `
    <title>${escapeHtml(title)}</title>
    <link rel="canonical" href="${escapeHtml(url)}" />
    <meta property="og:type" content="product" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${escapeHtml(url)}" />
    <meta property="og:image" content="${escapeHtml(image)}" />
    <meta property="og:image:secure_url" content="${escapeHtml(image)}" />
    <meta property="og:image:alt" content="${escapeHtml(product?.name ?? brandName)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(image)}" />
  `;
}

function injectMetaTags(html: string, metaTags: string) {
  return html.replace("</head>", `${metaTags}\n</head>`);
}

async function loadIndexHtml() {
  return readFile(path.join(distDir, "index.html"), "utf8");
}

app.use(express.static(distDir, { index: false }));

app.get("/product/:id", async (req, res) => {
  try {
    const indexHtml = await loadIndexHtml();
    const html = injectMetaTags(indexHtml, buildMetaTags(req, req.params.id));
    res.status(200).type("html").send(html);
  } catch (error) {
    res.status(500).type("text").send("Build the app first with `npm run build` before starting the preview server.");
  }
});

app.get("*", async (req, res) => {
  try {
    const indexHtml = await loadIndexHtml();
    const html = injectMetaTags(indexHtml, buildMetaTags(req));
    res.status(200).type("html").send(html);
  } catch {
    res.status(500).type("text").send("Build the app first with `npm run build` before starting the preview server.");
  }
});

app.listen(port, () => {
  console.log(`Share preview server listening on http://localhost:${port}`);
});
