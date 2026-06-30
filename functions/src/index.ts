import { initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { setGlobalOptions } from "firebase-functions/v2";
import { pipeline } from "@xenova/transformers";

initializeApp();
setGlobalOptions({
  region: "us-central1",
});

const db = getFirestore();
const CLIP_MODEL = process.env.CLIP_MODEL?.trim() || "Xenova/clip-vit-base-patch32";
const EMBEDDING_DIMENSION = 512;

type ClipExtractor = Awaited<ReturnType<typeof pipeline>>;

type ImageSearchMatch = {
  productId: string;
  rank: number;
  score: number;
  distance: number | null;
};

let extractorPromise: Promise<ClipExtractor> | null = null;

function getExtractor() {
  if (!extractorPromise) {
    extractorPromise = pipeline("feature-extraction", CLIP_MODEL);
  }

  return extractorPromise;
}

function parseBase64Image(base64Image: string) {
  const trimmed = base64Image.trim();
  if (!trimmed) {
    throw new HttpsError("invalid-argument", "Missing base64Image payload.");
  }

  if (trimmed.startsWith("data:image/")) {
    return trimmed;
  }

  return `data:image/jpeg;base64,${trimmed}`;
}

function toEmbeddingVector(values: unknown): number[] {
  if (!Array.isArray(values) && !(values instanceof Float32Array) && !(values instanceof Float64Array)) {
    throw new Error("CLIP returned an invalid embedding");
  }

  const vector = Array.from(values as ArrayLike<number>).slice(0, EMBEDDING_DIMENSION);
  if (vector.length !== EMBEDDING_DIMENSION) {
    throw new Error(`Expected ${EMBEDDING_DIMENSION}-dimensional embedding, got ${vector.length}`);
  }

  return vector.map((value) => Number(value));
}

function scoreFromDistance(distance: unknown, rank: number) {
  if (typeof distance === "number" && Number.isFinite(distance)) {
    const score = 100 - distance * 50;
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  return Math.max(0, 100 - rank * 4);
}

async function embedImage(base64Image: string) {
  const extractor = await getExtractor();
  const image = parseBase64Image(base64Image);
  const output = await (extractor as any)(image, {
    pooling: "mean",
    normalize: true,
  });

  return toEmbeddingVector((output as any).data ?? output);
}

async function findNearestProducts(embedding: number[]): Promise<ImageSearchMatch[]> {
  const queryVector = (FieldValue as any).vector(embedding);
  const productsRef = db.collection("products") as any;

  const snapshot = await productsRef
    .findNearest("embedding", queryVector, {
      limit: 10,
      distanceMeasure: "COSINE",
      distanceResultField: "distance",
    })
    .get();

  return snapshot.docs.map((doc: any, index: number) => {
    const data = typeof doc.data === "function" ? doc.data() : {};
    const distance = typeof data.distance === "number" ? data.distance : null;
    return {
      productId: doc.id,
      rank: index + 1,
      score: scoreFromDistance(distance, index + 1),
      distance,
    };
  });
}

export const imageSearch = onCall(
  {
    memory: "1GiB",
    timeoutSeconds: 120,
    minInstances: 1,
  },
  async (request) => {
    const base64Image = typeof request.data?.base64Image === "string" ? request.data.base64Image : "";
    if (!base64Image.trim()) {
      throw new HttpsError("invalid-argument", "base64Image is required.");
    }

    const embedding = await embedImage(base64Image);
    const matches = await findNearestProducts(embedding);

    return {
      provider: "firestore-vector",
      model: CLIP_MODEL,
      dimension: embedding.length,
      matches,
    };
  },
);
