export type BrowseMode = "women" | "men";

export interface Category {
  id: string;
  name: string;
  slug: string;
  itemCount: number;
  emoji: string;
  image: string;
  iconClass?: string;
  group: BrowseMode;
}

export const womenCategories: Category[] = [
  { id: "dresses", name: "Dresses", slug: "dresses", itemCount: 70, emoji: "👗", image: "https://i.ibb.co/ZRzKHy59/dress.png", group: "women" },
  { id: "two-pieces", name: "Two-Pieces", slug: "two-pieces", itemCount: 70, emoji: "👚", image: "https://i.ibb.co/LhZGMnf8/suit.png", group: "women" },
  { id: "shoes", name: "Shoes", slug: "shoes", itemCount: 70, emoji: "👠", image: "https://i.ibb.co/YFW3J1rF/high-heels.png", group: "women" },
  { id: "Accessories", name: "Accessories", slug: "Accessories", itemCount: 70, emoji: "👜", image: "https://i.ibb.co/JRgCLzRF/handbag.png", group: "women" },
  {
    id: "casual-clothes",
    name: "Casuals",
    slug: "casual-clothes",
    itemCount: 70,
    emoji: "👕",
    image: "https://static.thenounproject.com/png/895279-200.png",
    group: "women",
  },
];

export const menCategories: Category[] = [
  {
    id: "men-tops",
    name: "Tops",
    slug: "men-tops",
    itemCount: 70,
    emoji: "👔",
    image: "https://static.thenounproject.com/png/1043517-200.png",
    group: "men",
  },
  {
    id: "men-pants",
    name: "Pants",
    slug: "men-pants",
    itemCount: 70,
    emoji: "👖",
    image: "https://i.ibb.co/bg0VzqMY/360-F-262304072-NTtl-Ebg-JWF3-Ru-Vqp-Fw9ilo-TKhev-Tg-Jht-removebg-preview.png",
    group: "men",
  },
  {
    id: "men-shoes",
    name: "Shoes",
    slug: "men-shoes",
    itemCount: 70,
    emoji: "👟",
    image: "https://static.thenounproject.com/png/1283779-200.png",
    group: "men",
  },
  {
    id: "men-accessories",
    name: "Accessories",
    slug: "men-accessories",
    itemCount: 70,
    emoji: "🧢",
    image: "https://static.thenounproject.com/png/2373796-200.png",
    group: "men",
  },
];

export const categories: Category[] = [...womenCategories, ...menCategories];

export function getCategoriesForMode(mode: BrowseMode): Category[] {
  return mode === "men" ? menCategories : womenCategories;
}

export function getDefaultCategorySlug(mode: BrowseMode): string {
  return mode === "men" ? "men-tops" : "dresses";
}

export function getCategoryBySlug(slug: string | undefined, mode?: BrowseMode): Category | undefined {
  if (!slug) return undefined;
  const pool = mode ? getCategoriesForMode(mode) : categories;
  return pool.find((category) => category.slug === slug);
}
