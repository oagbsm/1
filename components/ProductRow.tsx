"use client";

import Image from "next/image";
import Link from "next/link";
import { products, productImages } from "@/data/store";

const IMG = "/example.png";

export default function ProductRow({ productIds, title }: { productIds: number[]; title: string }) {
  if (!productIds.length) return null;

  return (
    <div className="bg-white mt-2 p-3">
      <h3 className="text-sm font-semibold mb-3">{title}</h3>

      <div className="flex gap-3 overflow-x-auto">
        {productIds.map((id) => {
          const p = products.find((x) => x.id === id);
          if (!p) return null;

          const img = productImages.find((i) => i.product_id === p.id && i.is_primary);

          return (
            <Link
              key={p.id}
              href={`/product/${p.slug}`}
              className="min-w-[140px] border rounded-xl p-2 hover:shadow"
            >
              <Image
                src={img?.url || IMG}
                alt={p.name}
                width={140}
                height={140}
                className="w-full h-28 object-contain"
              />
              <div className="text-xs mt-2 line-clamp-2 text-black">{p.name}</div>
              <div className="text-sm font-bold mt-1 text-black">${p.base_price}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
