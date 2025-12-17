"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { useCart } from "@/context/CartContext";
import {
  subcategories,
  categories,
  products,
  productImages,
  productVariants,
} from "@/data/store";

import { getAvailableStock } from "@/lib/stock";
import { gtagEvent } from "@/lib/analytics"; // ✅ GA helper

const IMG = "/example.png";

export default function SubcategoryPage() {
  const router = useRouter();
  const params = useParams();
  const { addToCart } = useCart();

  const rawSlug = (params as any)?.slug;
  const slug =
    typeof rawSlug === "string"
      ? decodeURIComponent(rawSlug)
      : Array.isArray(rawSlug)
      ? decodeURIComponent(rawSlug[0] || "")
      : "";

  const subcategory = subcategories.find((s) => s.slug === slug);
  if (!subcategory) return <div className="p-6">Subcategory not found</div>;

  const category = categories.find((c) => c.id === subcategory.category_id);
  const subcategoryProducts = products.filter(
    (p) => p.subcategory_id === subcategory.id
  );
  const siblingSubcategories = subcategories.filter(
    (s) => s.category_id === subcategory.category_id
  );

  // ✅ GA4: view_item_list (list of products in this subcategory)
  useEffect(() => {
    if (!subcategoryProducts.length) return;

    gtagEvent("view_item_list", {
      item_list_name: subcategory.name,
      item_list_id: subcategory.id,
      items: subcategoryProducts.map((p) => ({
        item_id: p.id,
        item_name: p.name,
        item_category: category?.name,
        item_category2: subcategory.name,
        price: p.base_price,
      })),
    });
  }, [subcategory.id, subcategory.name, category?.name, subcategoryProducts]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#0A7C9E] px-3 py-2 text-white">
        <div className="flex items-center gap-2">
          <span onClick={() => router.back()} className="cursor-pointer">
            ⬅
          </span>
          <input
            placeholder={`Search ${subcategory.name}`}
            className="flex-1 rounded-md px-3 py-2 text-sm text-black"
          />
          🛒
        </div>
        <div className="text-xs mt-2">
          {category?.name} / {subcategory.name}
        </div>
      </div>

      <div className="flex">
        {/* LEFT SUBCATEGORIES */}
        <div className="w-20 bg-white border-r text-xs">
          {siblingSubcategories.map((s) => (
            <div
              key={s.id}
              onClick={() => router.push(`/subcategory/${s.slug}`)}
              className={`px-2 py-3 flex flex-col items-center gap-1 cursor-pointer ${
                s.id === subcategory.id ? "bg-blue-50 font-semibold" : ""
              }`}
            >
              <Image src={s.img || IMG} alt={s.name} width={28} height={28} />
              <span className="text-[10px] text-center">{s.name}</span>
            </div>
          ))}
        </div>

        {/* PRODUCTS */}
        <div className="grid grid-cols-2 gap-3 p-3 flex-1">
          {subcategoryProducts.map((p) => (
            <ProductCard
              key={p.id}
              productId={p.id}
              onOpen={() => router.push(`/product/${p.slug}`)}
              onAdd={(variantId) => {
                // 1) your cart logic
                addToCart({ product_id: p.id, variant_id: variantId, qty: 1 });

                // 2) GA4 add_to_cart
                const variant = productVariants.find((v) => v.id === variantId);
                const price = variant?.price ?? p.base_price;

                gtagEvent("add_to_cart", {
                  currency: "USD",
                  value: price,
                  items: [
                    {
                      item_id: p.id,
                      item_name: p.name,
                      item_category: category?.name,
                      item_category2: subcategory.name,
                      price,
                      quantity: 1,
                    },
                  ],
                });
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductCard({
  productId,
  onOpen,
  onAdd,
}: {
  productId: number;
  onOpen: () => void;
  onAdd: (variantId: number | null) => void;
}) {
  const p = products.find((x) => x.id === productId);
  if (!p) return null;

  const img = productImages.find((i) => i.product_id === p.id && i.is_primary);
  const variants = productVariants.filter((v) => v.product_id === p.id);

  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
    variants.length ? variants[0].id : null
  );

  const selectedVariant = useMemo(
    () => variants.find((v) => v.id === selectedVariantId) || null,
    [variants, selectedVariantId]
  );

  const price = selectedVariant?.price ?? p.base_price;

  const available = getAvailableStock(p.id, selectedVariantId);
  const outOfStock = available !== null && available <= 0;

  return (
    <div className="bg-white rounded-xl shadow-sm p-2 relative">
      <Heart className="absolute right-2 top-2 text-gray-400" size={16} />

      <Image
        src={img?.url || IMG}
        alt={p.name}
        width={150}
        height={150}
        className="mx-auto cursor-pointer object-contain"
        onClick={onOpen}
      />

      <div className="text-xs mt-1 line-clamp-2">{p.name}</div>
      <div className="font-semibold mt-1">${price}</div>
      {p.is_discounted && (
        <div className="text-red-500 text-xs">Discount</div>
      )}

      {/* ✅ Stock */}
      {available !== null && (
        <div className="text-[11px] text-gray-500 mt-1">
          Available: <span className="font-semibold">{available}</span>
        </div>
      )}

      {/* ✅ Variant chips on card */}
      {variants.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {variants.slice(0, 3).map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setSelectedVariantId(v.id)}
              disabled={v.stock === 0}
              className={`text-[11px] px-2 py-1 rounded border ${
                selectedVariantId === v.id
                  ? "border-green-600 bg-green-50"
                  : "border-gray-300"
              } ${
                v.stock === 0 ? "opacity-40 cursor-not-allowed" : ""
              }`}
            >
              {v.name}
            </button>
          ))}
        </div>
      )}

      <button
        disabled={outOfStock}
        onClick={() => onAdd(selectedVariantId)}
        className={`mt-2 w-full rounded-md text-sm py-1 ${
          outOfStock
            ? "bg-gray-200 text-gray-500"
            : "border border-green-600 text-green-600"
        }`}
      >
        {outOfStock ? "Out of stock" : "Add +"}
      </button>
    </div>
  );
}
