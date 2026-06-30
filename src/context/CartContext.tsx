import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Voucher, vouchers } from "../data/vouchers";
import { useSettings } from "./SettingsContext";
import { UserCartDoc } from "../lib/userAccount";

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  size: string;
  color: string;
  qty: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty"> & { qty?: number }) => void;
  replaceCart: (items: CartItem[], appliedVoucherCode?: string | null) => void;
  updateQty: (productId: string, size: string, color: string, qty: number) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  clearCart: () => void;
  appliedVoucher: Voucher | null;
  applyVoucher: (code: string) => boolean;
  removeVoucher: () => void;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function updateCartDoc(current: UserCartDoc, next: Partial<UserCartDoc>) {
  return {
    ...current,
    ...next,
  };
}

const GUEST_CART_STORAGE_KEY = "royal-prince-fashion.guestCart";

function loadGuestCart(): UserCartDoc {
  if (typeof window === "undefined") {
    return { items: [], appliedVoucherCode: null };
  }

  try {
    const raw = window.localStorage.getItem(GUEST_CART_STORAGE_KEY);
    if (!raw) {
      return { items: [], appliedVoucherCode: null };
    }

    const parsed = JSON.parse(raw) as Partial<UserCartDoc>;
    return {
      items: Array.isArray(parsed.items) ? parsed.items.map((item) => ({ ...item })) : [],
      appliedVoucherCode: parsed.appliedVoucherCode ?? null,
    };
  } catch {
    return { items: [], appliedVoucherCode: null };
  }
}

function saveGuestCart(cart: UserCartDoc) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(GUEST_CART_STORAGE_KEY, JSON.stringify(cart));
}

function clearGuestCart() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(GUEST_CART_STORAGE_KEY);
}

function mergeCartItems(baseItems: UserCartDoc["items"], incomingItems: UserCartDoc["items"]) {
  const merged = [...baseItems.map((item) => ({ ...item }))];

  for (const incoming of incomingItems) {
    const index = merged.findIndex(
      (item) =>
        item.productId === incoming.productId &&
        item.size === incoming.size &&
        item.color === incoming.color
    );

    if (index >= 0) {
      merged[index] = {
        ...merged[index],
        qty: merged[index].qty + incoming.qty,
      };
    } else {
      merged.push({ ...incoming });
    }
  }

  return merged;
}

function mergeCarts(base: UserCartDoc, incoming: UserCartDoc): UserCartDoc {
  return {
    items: mergeCartItems(base.items, incoming.items),
    appliedVoucherCode: base.appliedVoucherCode ?? incoming.appliedVoucherCode,
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { account, updateAccount, firebaseUser, authLoading } = useSettings();
  const cart = account.cart;
  const [guestCart, setGuestCart] = useState<UserCartDoc>(() => loadGuestCart());
  const hydratedUidRef = useRef<string | null>(null);

  useEffect(() => {
    if (!firebaseUser) {
      hydratedUidRef.current = null;
      setGuestCart(loadGuestCart());
      return;
    }

    if (authLoading) {
      return;
    }

    if (hydratedUidRef.current === firebaseUser.uid) {
      return;
    }

    const storedGuestCart = loadGuestCart();
    const hasGuestItems = storedGuestCart.items.length > 0 || Boolean(storedGuestCart.appliedVoucherCode);

    if (!hasGuestItems) {
      hydratedUidRef.current = firebaseUser.uid;
      return;
    }

    const mergedCart = mergeCarts(cart, storedGuestCart);
    hydratedUidRef.current = firebaseUser.uid;
    clearGuestCart();
    setGuestCart({ items: [], appliedVoucherCode: null });
    updateAccount({
      ...account,
      cart: mergedCart,
    });
  }, [account, authLoading, cart, firebaseUser, updateAccount]);

  const activeCart = firebaseUser ? cart : guestCart;
  const items = activeCart.items;
  const appliedVoucher = activeCart.appliedVoucherCode
    ? vouchers.find((voucher) => voucher.code.toUpperCase() === activeCart.appliedVoucherCode?.toUpperCase()) ?? null
    : null;
  const updateActiveCart = (next: Partial<UserCartDoc>) => updateCartDoc(activeCart, next);

  const persistCart = (next: UserCartDoc) => {
    if (firebaseUser) {
      updateAccount({
        ...account,
        cart: next,
      });
      return;
    }

    setGuestCart(next);
    saveGuestCart(next);
  };

  const addItem = (newItem: Omit<CartItem, "qty"> & { qty?: number }) => {
    const qtyToAdd = newItem.qty ?? 1;
    const existingIndex = items.findIndex(
      (i) => i.productId === newItem.productId && i.size === newItem.size && i.color === newItem.color
    );

    const nextItems =
      existingIndex > -1
        ? items.map((item, index) =>
            index === existingIndex ? { ...item, qty: item.qty + qtyToAdd } : item
          )
        : [...items, { ...newItem, qty: qtyToAdd }];

    persistCart(updateActiveCart({ items: nextItems }));
  };

  const replaceCart = (
    nextItems: CartItem[],
    appliedVoucherCode: string | null = activeCart.appliedVoucherCode
  ) => {
    persistCart(
      updateActiveCart({
        items: nextItems.map((item) => ({ ...item })),
        appliedVoucherCode,
      })
    );
  };

  const updateQty = (productId: string, size: string, color: string, qty: number) => {
    if (qty <= 0) {
      removeItem(productId, size, color);
      return;
    }

    const nextItems = items.map((item) =>
      item.productId === productId && item.size === size && item.color === color
        ? { ...item, qty }
        : item
    );

    persistCart(updateActiveCart({ items: nextItems }));
  };

  const removeItem = (productId: string, size: string, color: string) => {
    const nextItems = items.filter(
      (item) => !(item.productId === productId && item.size === size && item.color === color)
    );
    persistCart(updateActiveCart({ items: nextItems }));
  };

  const clearCart = () => {
    persistCart({ items: [], appliedVoucherCode: null });
  };

  const applyVoucher = (code: string): boolean => {
    const voucher = vouchers.find((v) => v.code.toUpperCase() === code.trim().toUpperCase());
    if (voucher) {
      persistCart(updateActiveCart({ appliedVoucherCode: voucher.code }));
      return true;
    }
    return false;
  };

  const removeVoucher = () => {
    persistCart(updateActiveCart({ appliedVoucherCode: null }));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const itemCount = items.reduce((sum, item) => sum + item.qty, 0);

  let discountAmount = 0;
  if (appliedVoucher) {
    if (appliedVoucher.discountType === "percent") {
      discountAmount = (subtotal * appliedVoucher.value) / 100;
    } else if (appliedVoucher.discountType === "fixed") {
      discountAmount = Math.min(subtotal, appliedVoucher.value);
    }
  }

  const isFreeShipping =
    subtotal > 50 || (appliedVoucher && appliedVoucher.discountType === "freeshipping");
  const shippingFee = items.length === 0 ? 0 : isFreeShipping ? 0 : 4.99;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        replaceCart,
        updateQty,
        removeItem,
        clearCart,
        appliedVoucher,
        applyVoucher,
        removeVoucher,
        subtotal,
        discountAmount,
        shippingFee,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
