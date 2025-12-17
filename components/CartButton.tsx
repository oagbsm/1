"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function CartButton() {
  const { items } = useCart();

  return (
    <Link href="/cart" className="relative">
      🛒
      {items.length > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
          {items.length}
        </span>
      )}
    </Link>
  );
}
