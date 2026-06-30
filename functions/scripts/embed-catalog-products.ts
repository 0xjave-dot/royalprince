import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { pipeline } from "@xenova/transformers";
import { products } from "../../src/data/products.ts";

type ProductSeed = (typeof products)[number];

const MODEL = process.env.CLIP_MODEL?.trim() || "Xenova/clip-vit-base-patch32";
const EMBEDDING_DIMENSION = 512;

function loadServiceAccount() {
  const inlineJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (inlineJson) {
    return JSON.parse(inlineJson);
  }

  const filePath = process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim();
  if (filePath) {
    const resolved = path.resolve(filePath);
    const raw = fs.readFileSync(resolved, "utf8");
    return JSON.parse(raw);
  }

  throw new Error(
    "Missing Firebase Admin credentials. Set FIREBASE_SERVICE_ACCOUNT_JSON or GOOGLE_APPLICATION_CREDENTIALS.",
  );
}

function pickProductImage(product: ProductSeed) {
  const image = product.images[0];
  if (!image) {
    throw new Error(`Product ${product.id} does not have a preview image.`);
  }

  return image;
}

async function getExtractor() {
  return pipeline("feature-extraction", MODEL);
}

async function embedImage(extractor: Awaited<ReturnType<typeof pipeline>>, imageUrl: string) {
  const output = await (extractor as any)(imageUrl, {
    pooling: "mean",
    normalize: true,
  });

  const values = Array.from(((output as any).data ?? output) as ArrayLike<number>).slice(0, EMBEDDING_DIMENSION);
  if (values.length !== EMBEDDING_DIMENSION) {
    throw new Error(`Expected ${EMBEDDING_DIMENSION}-dimensional embedding, got ${values.length}`);
  }

  return values.map((value) => Number(value));
}

async function main() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(loadServiceAccount()),
    });
  }

  const db = admin.firestore();
  const extractor = await getExtractor();

  console.log(`Embedding ${products.length} catalog products with ${MODEL}...`);

  for (const product of products) {
    const imageUrl = pickProductImage(product);
    const embedding = await embedImage(extractor, imageUrl);

    await db.collection("products").doc(product.id).set(
      {
        id: product.id,
        name: product.name,
        category: product.category,
        subType: product.subType ?? null,
        imageUrl,
        embedding: (FieldValue as any).vector(embedding),
        embeddingModel: MODEL,
        embeddingDimension: embedding.length,
        embeddingSource: "clip-vit-base-patch32",
        embeddingUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    console.log(`Embedded ${product.id}`);
  }

  console.log("Done.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
