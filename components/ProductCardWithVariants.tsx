"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { products, productImages, productVariants } from "@/data/store";

const IMG = "/example.png";

// OPTIONAL: if you don’t have variant images, this returns null and we keep product image
function getVariantImageUrl(productId: number, variantId: number | null) {
  // If later you add a productVariantImages table, use it here.
  return null;
}

export default function ProductCardWithVariants({ productId }: { productId: number }) {
  const p = products.find((x) => x.id === productId);
  if (!p) return null;

  const variants = productVariants.filter((v) => v.product_id === p.id);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
    variants.length ? variants[0].id : null
  );

  const selectedVariant = variants.find((v) => v.id === selectedVariantId) || null;

  const baseImg = productImages.find((i) => i.product_id === p.id && i.is_primary)?.url || IMG;

  // ✅ Only switch image when variant toggled (and only if variant image exists)
  const imgUrl = useMemo(() => {
    const vImg = selectedVariantId ? getVariantImageUrl(p.id, selectedVariantId) : null;
    return vImg || baseImg;
  }, [baseImg, p.id, selectedVariantId]);

  const price = selectedVariant?.price ?? p.base_price;

  return (
    <div className="border rounded-xl p-3 hover:shadow bg-white">
      <Link href={`/product/${p.slug}`} className="block">
        <Image
          src={imgUrl}
          alt={p.name}
          width={200}
          height={200}
          className="object-contain mx-auto"
        />
        <h3 className="text-sm mt-2 font-medium text-black line-clamp-2">{p.name}</h3>
      </Link>

      <p className="text-blue-600 font-semibold mt-1">${price}</p>

      {/* ✅ Variant chips on the CARD */}
      {variants.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {variants.slice(0, 4).map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setSelectedVariantId(v.id)}
              disabled={v.stock === 0}
              className={`text-xs px-2 py-1 rounded border
                ${selectedVariantId === v.id ? "border-green-600 bg-green-50" : "border-gray-300"}
                ${v.stock === 0 ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-50"}
              `}
            >
              {v.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
