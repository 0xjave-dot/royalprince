import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  size: string;
  color: string;
  qty: number;
}

export interface ShippingAddress {
  id: string;
  tag: string;
  name: string;
  street: string;
  cityStateCountry: string;
  isDefault: boolean;
}

export interface RewardsSummary {
  points: number;
  tier: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  status: "placed" | "processing" | "shipped" | "out_for_delivery" | "delivered";
  date: string;
  estDelivery: string;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  checkoutMode?: "self" | "gift";
  giftRecipientName?: string;
  giftMessage?: string;
  sharedWithLovedOne?: boolean;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  timeAgo: string;
}

export interface UserSettingsDoc {
  sizeUnit: "UK" | "EU" | "US";
  currency: "NGN" | "USD" | "EUR" | "GBP";
  language: string;
  country: string;
  mySize: string;
  myShoeSize: string;
  pushNotifications: boolean;
}

export interface UserCartDoc {
  items: CartItem[];
  appliedVoucherCode: string | null;
}

export interface UserWishlistDoc {
  productIds: string[];
}

export interface UserOrdersDoc {
  items: Order[];
}

export interface UserShippingDoc {
  items: ShippingAddress[];
  defaultAddressId: string;
}

export interface UserReviewsDoc {
  items: Review[];
}

export interface UserAccountDoc {
  settings: UserSettingsDoc;
  cart: UserCartDoc;
  wishlist: UserWishlistDoc;
  orders: UserOrdersDoc;
  shippingAddresses: UserShippingDoc;
  rewards: RewardsSummary;
  reviews: UserReviewsDoc;
  updatedAt?: unknown;
}

export const EMPTY_REWARDS: RewardsSummary = {
  points: 0,
  tier: "Bronze",
};

export const DEFAULT_USER_SETTINGS: UserSettingsDoc = {
  sizeUnit: "UK",
  currency: "NGN",
  language: "English",
  country: "Nigeria",
  mySize: "M",
  myShoeSize: "40",
  pushNotifications: true,
};

export const DEFAULT_USER_ACCOUNT: UserAccountDoc = {
  settings: DEFAULT_USER_SETTINGS,
  cart: {
    items: [],
    appliedVoucherCode: null,
  },
  wishlist: {
    productIds: [],
  },
  orders: {
    items: [],
  },
  shippingAddresses: {
    items: [],
    defaultAddressId: "",
  },
  rewards: EMPTY_REWARDS,
  reviews: {
    items: [],
  },
};

function normalizeAddress(address: ShippingAddress): ShippingAddress {
  return {
    ...address,
    isDefault: Boolean(address.isDefault),
  };
}

function normalizeOrder(order: Order): Order {
  return {
    ...order,
    items: order.items.map((item) => ({ ...item })),
    shippingAddress: normalizeAddress(order.shippingAddress),
    checkoutMode: order.checkoutMode ?? "self",
    giftRecipientName: order.giftRecipientName ?? "",
    giftMessage: order.giftMessage ?? "",
    sharedWithLovedOne: Boolean(order.sharedWithLovedOne),
  };
}

function normalizeReview(review: Review): Review {
  return { ...review };
}

function normalizeDoc(docData: Partial<UserAccountDoc> | undefined): UserAccountDoc {
  const account = docData ?? {};
  const settings = {
    ...DEFAULT_USER_SETTINGS,
    ...(account.settings ?? {}),
  };
  const addresses = (account.shippingAddresses?.items ?? []).map(normalizeAddress);
  const defaultAddressId =
    account.shippingAddresses?.defaultAddressId ||
    addresses.find((address) => address.isDefault)?.id ||
    "";

  return {
    settings,
    cart: {
      items: (account.cart?.items ?? []).map((item) => ({ ...item })),
      appliedVoucherCode: account.cart?.appliedVoucherCode ?? null,
    },
    wishlist: {
      productIds: [...(account.wishlist?.productIds ?? [])],
    },
    orders: {
      items: (account.orders?.items ?? []).map(normalizeOrder),
    },
    shippingAddresses: {
      items: addresses,
      defaultAddressId,
    },
    rewards: account.rewards ?? EMPTY_REWARDS,
    reviews: {
      items: (account.reviews?.items ?? []).map(normalizeReview),
    },
    updatedAt: account.updatedAt,
  };
}

function normalizePatch(data: Partial<UserAccountDoc>): Partial<UserAccountDoc> {
  const patch: Partial<UserAccountDoc> = {};

  if (data.settings) {
    patch.settings = {
      ...DEFAULT_USER_SETTINGS,
      ...data.settings,
    };
  }

  if (data.cart) {
    patch.cart = {
      items: (data.cart.items ?? []).map((item) => ({ ...item })),
      appliedVoucherCode: data.cart.appliedVoucherCode ?? null,
    };
  }

  if (data.wishlist) {
    patch.wishlist = {
      productIds: [...(data.wishlist.productIds ?? [])],
    };
  }

  if (data.orders) {
    patch.orders = {
      items: (data.orders.items ?? []).map(normalizeOrder),
    };
  }

  if (data.shippingAddresses) {
    const items = (data.shippingAddresses.items ?? []).map(normalizeAddress);
    patch.shippingAddresses = {
      items,
      defaultAddressId:
        data.shippingAddresses.defaultAddressId ||
        items.find((address) => address.isDefault)?.id ||
        "",
    };
  }

  if (data.rewards) {
    patch.rewards = data.rewards;
  }

  if (data.reviews) {
    patch.reviews = {
      items: (data.reviews.items ?? []).map(normalizeReview),
    };
  }

  return patch;
}

export async function ensureUserAccountDoc(uid: string): Promise<UserAccountDoc> {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(
      ref,
      {
        ...DEFAULT_USER_ACCOUNT,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return DEFAULT_USER_ACCOUNT;
  }

  const normalized = normalizeDoc(snap.data() as Partial<UserAccountDoc>);
  await setDoc(
    ref,
    {
      ...normalized,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  return normalized;
}

export async function getUserAccountDoc(uid: string): Promise<UserAccountDoc> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) {
    return DEFAULT_USER_ACCOUNT;
  }
  return normalizeDoc(snap.data() as Partial<UserAccountDoc>);
}

export async function setUserAccountDoc(uid: string, data: Partial<UserAccountDoc>): Promise<void> {
  const ref = doc(db, "users", uid);
  const merged = normalizePatch(data);

  await setDoc(
    ref,
    {
      ...merged,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function setUserAddresses(uid: string, addresses: ShippingAddress[]): Promise<void> {
  const normalized = addresses.map(normalizeAddress);
  const defaultAddressId = normalized.find((address) => address.isDefault)?.id || "";

  await setUserAccountDoc(uid, {
    shippingAddresses: {
      items: normalized,
      defaultAddressId,
    },
  });
}
