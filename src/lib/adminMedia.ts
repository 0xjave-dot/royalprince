import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./firebase";

function safeName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64) || "asset";
}

export async function uploadProductImages(productId: string, files: File[]) {
  const uploads = files.slice(0, 4).map(async (file, index) => {
    const stamp = `${Date.now()}-${index}`;
    const storageRef = ref(storage, `catalog/products/${safeName(productId)}/${stamp}-${safeName(file.name)}`);
    await uploadBytes(storageRef, file, {
      contentType: file.type || "application/octet-stream",
    });
    return getDownloadURL(storageRef);
  });

  return Promise.all(uploads);
}

export async function uploadCategoryImage(categorySlug: string, file: File) {
  const stamp = Date.now();
  const storageRef = ref(storage, `catalog/categories/${safeName(categorySlug)}/${stamp}-${safeName(file.name)}`);
  await uploadBytes(storageRef, file, {
    contentType: file.type || "application/octet-stream",
  });
  return getDownloadURL(storageRef);
}
