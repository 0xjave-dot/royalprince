import { useEffect, useMemo, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Product } from "../data/products";
import { products as seedProducts } from "../data/products";
import type { Category } from "../data/categories";
import { categories as seedCategories } from "../data/categories";
import type { Voucher } from "../data/vouchers";
import { vouchers as seedVouchers } from "../data/vouchers";
import type { Review } from "../data/reviews";
import { initialReviews } from "../data/reviews";
import type { NewArrivalEntry } from "../data/newArrivals";
import { womenNewArrivalsSchedule as seedNewArrivals } from "../data/newArrivals";

export type CatalogStatus = "draft" | "active" | "archived";

export type CatalogProduct = Product & {
  sku?: string;
  status?: CatalogStatus;
  stockThreshold?: number;
  stockByVariant?: Record<string, number>;
  primaryImageIndex?: number;
  deleted?: boolean;
  updatedAt?: unknown;
  createdAt?: unknown;
};

export type CatalogCategory = Category & {
  active?: boolean;
  deleted?: boolean;
  updatedAt?: unknown;
};

export type CatalogVoucher = Voucher & {
  active?: boolean;
  usageLimit?: number;
  usedCount?: number;
  expiresAt?: string;
  deleted?: boolean;
  updatedAt?: unknown;
};

export type CatalogReview = Review & {
  featured?: boolean;
  approved?: boolean;
  hidden?: boolean;
  customerPhotoUrl?: string;
  updatedAt?: unknown;
};

export type CatalogNewArrivalEntry = NewArrivalEntry & {
  id: string;
  index: number;
  active?: boolean;
  updatedAt?: unknown;
};

type CollectionResult<T> = {
  items: T[];
  loading: boolean;
};

function isVisibleRecord(record: { deleted?: boolean; status?: string; active?: boolean; hidden?: boolean }) {
  if (record.deleted) return false;
  if (record.status === "archived") return false;
  if (record.active === false) return false;
  if (record.hidden) return false;
  return true;
}

function mergeById<T extends Record<string, any>>(seed: T[], remote: T[], key: keyof T & string): T[] {
  const items = new Map<string, T>();

  seed.forEach((item) => {
    const id = String(item[key]);
    items.set(id, item);
  });

  remote.forEach((item) => {
    const id = String(item[key]);
    if (!isVisibleRecord(item)) {
      items.delete(id);
      return;
    }

    const existing = items.get(id);
    items.set(id, {
      ...(existing ?? {}),
      ...item,
    });
  });

  return Array.from(items.values());
}

function sortByUpdatedAtDescending<T extends { updatedAt?: unknown }>(items: T[]): T[] {
  const toTime = (value: unknown) => {
    if (value instanceof Date) return value.getTime();
    if (typeof value === "number") return value;
    if (value && typeof value === "object" && "toMillis" in value && typeof (value as { toMillis?: unknown }).toMillis === "function") {
      return (value as { toMillis: () => number }).toMillis();
    }
    return 0;
  };

  return [...items].sort((a, b) => {
    const aTime = toTime(a.updatedAt);
    const bTime = toTime(b.updatedAt);
    return bTime - aTime;
  });
}

function useCollectionSnapshot<T extends Record<string, any>>(collectionName: string) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, collectionName),
      (snapshot) => {
        setItems(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() } as unknown as T)));
        setLoading(false);
      },
      () => {
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [collectionName]);

  return { items, loading } as CollectionResult<T>;
}

export function useProducts(): { products: CatalogProduct[]; loading: boolean } {
  const remote = useCollectionSnapshot<CatalogProduct>("products");

  const products = useMemo(
    () => mergeById(seedProducts as CatalogProduct[], remote.items, "id"),
    [remote.items],
  );

  const sortedProducts = useMemo(() => sortByUpdatedAtDescending(products), [products]);

  return { products: sortedProducts, loading: remote.loading };
}

export function useCategories(): { categories: CatalogCategory[]; loading: boolean } {
  const remote = useCollectionSnapshot<CatalogCategory>("categories");

  const categories = useMemo(
    () => mergeById(seedCategories as CatalogCategory[], remote.items, "slug"),
    [remote.items],
  );

  const sortedCategories = useMemo(() => sortByUpdatedAtDescending(categories), [categories]);

  return { categories: sortedCategories, loading: remote.loading };
}

export function useVouchers(): { vouchers: CatalogVoucher[]; loading: boolean } {
  const remote = useCollectionSnapshot<CatalogVoucher>("vouchers");

  const vouchers = useMemo(
    () => mergeById(seedVouchers as CatalogVoucher[], remote.items, "code"),
    [remote.items],
  );

  const sortedVouchers = useMemo(() => sortByUpdatedAtDescending(vouchers), [vouchers]);

  return { vouchers: sortedVouchers, loading: remote.loading };
}

export function useReviews(): { reviews: CatalogReview[]; loading: boolean } {
  const remote = useCollectionSnapshot<CatalogReview>("reviews");

  const reviews = useMemo(
    () => mergeById(initialReviews as CatalogReview[], remote.items, "id"),
    [remote.items],
  );

  const sortedReviews = useMemo(() => sortByUpdatedAtDescending(reviews), [reviews]);

  return { reviews: sortedReviews, loading: remote.loading };
}

export function useNewArrivals(): { schedule: CatalogNewArrivalEntry[]; loading: boolean } {
  const remote = useCollectionSnapshot<CatalogNewArrivalEntry>("newArrivals");

  const schedule = useMemo(() => {
    const seed = seedNewArrivals.map((entry, index) => ({
      id: `slot-${index}`,
      index,
      ...entry,
    }));

    if (remote.items.length === 0) {
      return seed;
    }

    const remoteByIndex = [...remote.items].sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
    const merged = remoteByIndex.map((entry, index) => ({
      id: entry.id || `slot-${index}`,
      index: entry.index ?? index,
      title: entry.title,
      productIds: [...(entry.productIds ?? [])],
      active: entry.active !== false,
      updatedAt: entry.updatedAt,
    }));

    return merged.length > 0 ? merged : seed;
  }, [remote.items]);

  return { schedule, loading: remote.loading };
}

export function getTodaysNewArrivalEntry(schedule: CatalogNewArrivalEntry[], date = new Date()) {
  if (schedule.length === 0) {
    return null;
  }

  const dayNumber = Math.floor(date.getTime() / 86_400_000);
  return schedule[dayNumber % schedule.length] ?? null;
}

export async function saveNewArrivals(schedule: Array<Omit<CatalogNewArrivalEntry, "id" | "index">>) {
  const batch = writeBatch(db);

  schedule.forEach((entry, index) => {
    const id = `slot-${index}`;
    batch.set(
      doc(db, "newArrivals", id),
      {
        id,
        index,
        ...entry,
        active: entry.active !== false,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  });

  await batch.commit();
}

export function buildSku(category: string, color: string, size: string, suffix = "") {
  const slugify = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const base = [category, color, size].filter(Boolean).map(slugify).join("-");
  return suffix ? `${base}-${slugify(suffix)}` : base;
}

export function normalizeListInput(value: string) {
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

export async function saveCatalogProduct(product: CatalogProduct) {
  const ref = doc(db, "products", product.id);
  await setDoc(
    ref,
    {
      ...product,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function archiveCatalogProduct(id: string) {
  await setDoc(
    doc(db, "products", id),
    {
      status: "archived",
      deleted: true,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function saveCatalogCategory(category: CatalogCategory) {
  await setDoc(
    doc(db, "categories", category.slug),
    {
      ...category,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function archiveCatalogCategory(slug: string) {
  await setDoc(
    doc(db, "categories", slug),
    {
      active: false,
      deleted: true,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function saveCatalogVoucher(voucher: CatalogVoucher) {
  await setDoc(
    doc(db, "vouchers", voucher.code),
    {
      ...voucher,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function archiveCatalogVoucher(code: string) {
  await setDoc(
    doc(db, "vouchers", code),
    {
      active: false,
      deleted: true,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function deleteReview(reviewId: string) {
  await deleteDoc(doc(db, "reviews", reviewId));
}
