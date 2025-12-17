"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/store";
import { getCartAlsoBought } from "@/lib/coPurchase";

export default function HomeHeroCard() {
  const { items } = useCart();

  const hero = useMemo(() => {
    const cartIds = items.map(i => i.product_id);
    if (cartIds.length === 0) return null;

    const also = getCartAlsoBought(cartIds, 1, 1); // minCount=1 for now
    const topId = also[0];
    if (!topId) return null;

    const p = products.find(x => x.id === topId);
    if (!p) return null;

    return {
      title: p.name,
      subtitle: "Frequently bought with items in your cart",
      href: `/product/${p.slug}`,
    };
  }, [items]);

  if (!hero) return null;

  return (
    <Link href={hero.href} className="h-48 rounded-xl bg-blue-50 border p-6 hover:shadow block">
      <p className="text-xs text-blue-600 font-semibold mb-2">{hero.subtitle}</p>
      <h3 className="text-xl font-bold text-black">{hero.title}</h3>
      <p className="text-sm text-gray-600 mt-2 underline">View</p>
    </Link>
  );
}
