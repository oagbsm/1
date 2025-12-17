"use client";

import { createContext, useContext, useState } from "react";
import { gtag } from "@/lib/gtag"; // ✅ import

export type CartItem = {
  product_id: number;
  variant_id?: number | null;
  qty: number;
};

export type CartContextType = {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  updateQty: (index: number, qty: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  function addToCart(item: CartItem) {
    // ⬇️ GA4 EVENT FIRE HERE
    gtag("event", "add_to_cart", {
      currency: "USD",
      value: 0, // optional — GA4 recommends value, but it's okay to leave 0
      items: [
        {
          item_id: item.product_id,
          item_variant: item.variant_id ?? null,
          quantity: item.qty,
        },
      ],
    });

    // ⬇️ Your existing logic
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) =>
          i.product_id === item.product_id &&
          i.variant_id === item.variant_id
      );

      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex].qty += item.qty;
        return updated;
      }

      return [...prev, item];
    });
  }

  function removeFromCart(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function updateQty(index: number, qty: number) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, qty } : item))
    );
  }

  function clearCart() {
    setItems([]);
  }

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQty, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}
