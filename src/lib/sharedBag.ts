import { products } from "../data/products";
import type { CartItem } from "../context/CartContext";

interface LegacySharedBagPayload {
  items?: CartItem[];
  checkoutMode?: "self" | "gift";
  giftRecipientName?: string;
  giftMessage?: string;
}

export interface DecodedSharedBag {
  items: CartItem[];
  checkoutMode: "self" | "gift";
  giftRecipientName: string;
  giftMessage: string;
}

function cartItemToToken(item: CartItem) {
  const productIndex = products.findIndex((product) => product.id === item.productId);

  if (productIndex < 0) {
    return null;
  }

  const product = products[productIndex];
  const sizeIndex = product.sizes.indexOf(item.size);
  const colorIndex = product.colors.indexOf(item.color);

  if (sizeIndex < 0 || colorIndex < 0) {
    return null;
  }

  return [productIndex.toString(36), sizeIndex.toString(36), colorIndex.toString(36), item.qty.toString(36)].join(".");
}

function tokenToCartItem(token: string): CartItem | null {
  const parts = token.split(".");
  if (parts.length !== 4) {
    return null;
  }

  const [productIndexToken, sizeIndexToken, colorIndexToken, qtyToken] = parts;
  const productIndex = Number.parseInt(productIndexToken, 36);
  const sizeIndex = Number.parseInt(sizeIndexToken, 36);
  const colorIndex = Number.parseInt(colorIndexToken, 36);
  const qty = Number.parseInt(qtyToken, 36);

  if (
    !Number.isInteger(productIndex) ||
    !Number.isInteger(sizeIndex) ||
    !Number.isInteger(colorIndex) ||
    !Number.isInteger(qty) ||
    productIndex < 0 ||
    sizeIndex < 0 ||
    colorIndex < 0 ||
    qty <= 0
  ) {
    return null;
  }

  const product = products[productIndex];
  const size = product?.sizes[sizeIndex];
  const color = product?.colors[colorIndex];

  if (!product || !size || !color) {
    return null;
  }

  return {
    productId: product.id,
    name: product.name,
    image: product.images[0] ?? "",
    price: product.price,
    size,
    color,
    qty,
  };
}

function normalizeItems(items: unknown): CartItem[] {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const candidate = item as Partial<CartItem>;
      const product = candidate.productId ? products.find((entry) => entry.id === candidate.productId) : null;

      if (
        !product ||
        typeof candidate.productId !== "string" ||
        typeof candidate.size !== "string" ||
        typeof candidate.color !== "string" ||
        typeof candidate.qty !== "number" ||
        !Number.isFinite(candidate.qty) ||
        candidate.qty <= 0
      ) {
        return null;
      }

      return {
        productId: candidate.productId,
        name: product.name,
        image: product.images[0] ?? "",
        price: product.price,
        size: candidate.size,
        color: candidate.color,
        qty: candidate.qty,
      };
    })
    .filter((item): item is CartItem => Boolean(item));
}

export function encodeSharedBag(items: CartItem[], checkoutMode: "self" | "gift" = "self") {
  const tokens = items.map(cartItemToToken).filter((token): token is string => Boolean(token));
  return `${checkoutMode === "gift" ? "g" : "s"}~${tokens.join("-")}`;
}

export function decodeSharedBag(value: string): DecodedSharedBag | null {
  try {
    if (value.includes("~")) {
      const [modeToken, itemsToken] = value.split("~");
      const checkoutMode = modeToken === "g" ? "gift" : "self";
      const items = itemsToken
        ? itemsToken.split("-").map(tokenToCartItem).filter((item): item is CartItem => Boolean(item))
        : [];

      if (items.length === 0) {
        return null;
      }

      return {
        items,
        checkoutMode,
        giftRecipientName: "",
        giftMessage: "",
      };
    }

    const padded = value.replaceAll("-", "+").replaceAll("_", "/");
    const fixed = padded + "=".repeat((4 - (padded.length % 4)) % 4);
    const decoded = atob(fixed);
    const parsed = JSON.parse(decoded) as Partial<LegacySharedBagPayload>;

    if (!Array.isArray(parsed.items)) {
      return null;
    }

    const items = normalizeItems(parsed.items);

    if (items.length === 0) {
      return null;
    }

    return {
      items,
      checkoutMode: parsed.checkoutMode === "gift" ? "gift" : "self",
      giftRecipientName: typeof parsed.giftRecipientName === "string" ? parsed.giftRecipientName : "",
      giftMessage: typeof parsed.giftMessage === "string" ? parsed.giftMessage : "",
    };
  } catch {
    return null;
  }
}
