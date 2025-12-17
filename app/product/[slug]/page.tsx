"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Heart, Minus, Plus, Share2 } from "lucide-react";

import { useCart } from "@/context/CartContext";
import {
  products,
  productImages,
  productVariants,
  categories,
  subcategories,
} from "@/data/store";

import ProductRow from "@/components/ProductRow";
import { loadUserProfile, saveUserProfile } from "@/data/user";

import { getAlsoBoughtFromCounts } from "@/lib/coPurchase";
import { getAvailableStock } from "@/lib/stock";
import { getVariantImageUrl } from "@/lib/variantImage";
import { gtagEvent } from "@/lib/analytics"; // ✅ GA helper

const IMG = "/example.png";

export default function ProductPage() {
  const router = useRouter();
  const params = useParams();
  const { addToCart } = useCart();

  // ✅ normalize slug (string | string[])
  const rawSlug = (params as any)?.slug;
  const slug =
    typeof rawSlug === "string"
      ? decodeURIComponent(rawSlug)
      : Array.isArray(rawSlug)
      ? decodeURIComponent(rawSlug[0] || "")
      : "";

  const product = products.find((p) => p.slug === slug);
  if (!product) return <div className="p-6">Product not found</div>;

  const variants = productVariants.filter((v) => v.product_id === product.id);
  const [selectedVariant, setSelectedVariant] = useState(
    variants.length ? variants[0] : null
  );
  const [qty, setQty] = useState(1);

  const subcategory = subcategories.find((s) => s.id === product.subcategory_id);
  const category = categories.find((c) => c.id === subcategory?.category_id);

  const price = selectedVariant?.price ?? product.base_price;

  // ✅ stock/quantity
  const available = getAvailableStock(product.id, selectedVariant?.id ?? null);
  const outOfStock = available !== null && available <= 0;

  // ✅ Single image: variant image when toggled, else primary product image
  const baseImg =
    productImages.find((i) => i.product_id === product.id && i.is_primary)
      ?.url ||
    productImages.find((i) => i.product_id === product.id)?.url ||
    IMG;

  const variantImg = getVariantImageUrl(selectedVariant?.id ?? null);
  const mainImg = variantImg || baseImg;

  // ✅ Others also bought (from coPurchaseCounts)
  const alsoBoughtIds = useMemo(
    () => getAlsoBoughtFromCounts(product.id, 8, 1),
    [product.id]
  );

  function clampQty(next: number) {
    if (available === null) return Math.max(1, next);
    return Math.max(1, Math.min(available, next));
  }

  function logAddToCartInterest(productId: number, subcategoryId?: number) {
    const profile = loadUserProfile();
    profile.productInterestScores[String(productId)] =
      (profile.productInterestScores[String(productId)] || 0) + 5;

    if (subcategoryId) {
      profile.subcategoryInterestScores[String(subcategoryId)] =
        (profile.subcategoryInterestScores[String(subcategoryId)] || 0) + 5;
    }
    saveUserProfile(profile);
  }

  // ✅ GA4: view_item
  useEffect(() => {
    gtagEvent("view_item", {
      currency: "USD",
      value: price,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          item_category: category?.name,
          item_category2: subcategory?.name,
          price,
        },
      ],
    });
  }, [product.id, price, category?.name, subcategory?.name]);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-[#0A7C9E] px-3 py-2 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ArrowLeft
            size={20}
            className="cursor-pointer"
            onClick={() => router.back()}
          />
          <span className="text-sm font-semibold line-clamp-1">
            {product.name}
          </span>
        </div>
        <div className="flex gap-3">
          <Share2 size={18} />
          <Heart size={18} />
        </div>
      </div>

      {/* ✅ Main Image (single) */}
      <div className="bg-white p-3 flex justify-center">
        <Image
          src={mainImg}
          alt={product.name}
          width={320}
          height={320}
          className="rounded-lg object-contain"
        />
      </div>

      {/* Info */}
      <div className="bg-white mt-2 p-3">
        <div className="text-xs text-gray-500 mb-1">
          {category?.name} / {subcategory?.name}
        </div>

        <h1 className="text-lg font-semibold">{product.name}</h1>

        <div className="mt-2 flex items-center gap-2">
          <span className="text-xl font-bold">${price}</span>
          {product.is_discounted && (
            <span className="text-xs text-red-500">Discount</span>
          )}
        </div>

        {/* ✅ Available stock */}
        {available !== null && (
          <div className="text-xs text-gray-500 mt-1">
            Available: <span className="font-semibold">{available}</span>
          </div>
        )}

        {/* ✅ Variants */}
        {variants.length > 0 && (
          <div className="mt-4">
            <div className="text-sm font-semibold mb-2">Choose Option</div>
            <div className="flex flex-wrap gap-2">
              {variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => {
                    setSelectedVariant(v);
                    setQty(1); // reset qty when switching variant
                  }}
                  disabled={v.stock === 0}
                  className={`border rounded-md px-3 py-2 text-sm ${
                    selectedVariant?.id === v.id
                      ? "border-green-600 bg-green-50"
                      : "border-gray-300"
                  } ${v.stock === 0 ? "opacity-40 cursor-not-allowed" : ""}`}
                >
                  {v.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <p className="text-sm text-gray-600 mt-4 leading-relaxed">
          {product.long_description}
        </p>
      </div>

      {/* ✅ Others also bought */}
      <ProductRow title="Others also bought" productIds={alsoBoughtIds} />

      {/* Quantity selector */}
      <div className="bg-white mt-2 p-3 flex items-center justify-between">
        <span className="font-semibold text-sm">Quantity</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQty((q) => clampQty(q - 1))}
            className="w-8 h-8 border rounded flex items-center justify-center"
          >
            <Minus size={14} />
          </button>

          <span className="font-semibold">{qty}</span>

          <button
            onClick={() => setQty((q) => clampQty(q + 1))}
            className="w-8 h-8 border rounded flex items-center justify-center"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Action Bar */}
      <div className="fixed bottom-0 w-full bg-white border-t p-3 flex gap-3">
        <button
          disabled={outOfStock}
          onClick={() => {
            // 1) add to cart
            addToCart({
              product_id: product.id,
              variant_id: selectedVariant?.id ?? null,
              qty,
            });
            logAddToCartInterest(product.id, product.subcategory_id);

            // 2) GA4 add_to_cart
            gtagEvent("add_to_cart", {
              currency: "USD",
              value: price * qty,
              items: [
                {
                  item_id: product.id,
                  item_name: product.name,
                  item_category: category?.name,
                  item_category2: subcategory?.name,
                  price,
                  quantity: qty,
                },
              ],
            });
          }}
          className={`flex-1 rounded-md py-2 font-semibold ${
            outOfStock
              ? "bg-gray-200 text-gray-500"
              : "border border-green-600 text-green-600"
          }`}
        >
          {outOfStock ? "Out of stock" : "Add to Cart"}
        </button>

        <button className="flex-1 bg-green-600 text-white rounded-md py-2 font-semibold">
          Buy Now
        </button>
      </div>
    </div>
  );
}
