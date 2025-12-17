"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { getCartAlsoBought } from "@/lib/coPurchase";

import { useCart } from "@/context/CartContext";
import { products, productImages, productVariants, checkoutCart } from "@/data/store";
import { getCartRecommendations } from "@/lib/recommendations";
import ProductRow from "@/components/ProductRow";

const IMG = "/example.png";

export default function CartPage() {
  const { items, removeFromCart, updateQty, clearCart } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  const total = items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.product_id);
    const variant = productVariants.find((v) => v.id === item.variant_id);
    const price = variant?.price ?? product?.base_price ?? 0;
    return sum + price * item.qty;
  }, 0);

const recoIds = useMemo(() => {
  const cartIds = items.map(i => i.product_id);
  return getCartAlsoBought(cartIds, 8, 1);
}, [items]);

  if (!items.length && !orderPlaced) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-lg font-semibold">Your cart is empty</h2>
        <Link href="/" className="text-green-600 mt-2 inline-block">
          Continue shopping
        </Link>
      </div>
    );
  }

  function handleCheckout() {
    if (!items.length) return;
    const order = checkoutCart(items); // ✅ this creates co-purchase data in orders
    setOrderId(order.id);
    setOrderPlaced(true);
    clearCart();
  }

  if (orderPlaced) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-lg font-semibold text-green-600">Order Placed Successfully!</h2>
        <p className="mt-2">Your Order ID: {orderId}</p>
        <Link href="/" className="text-green-600 mt-4 inline-block">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <h1 className="text-lg font-semibold p-4 bg-white border-b">Cart ({items.length})</h1>

      <div className="p-3 space-y-3">
        {items.map((item, index) => {
          const product = products.find((p) => p.id === item.product_id);
          if (!product) return null;

          const variant = productVariants.find((v) => v.id === item.variant_id);
          const img = productImages.find((i) => i.product_id === product.id && i.is_primary);
          const price = variant?.price ?? product.base_price;

          return (
            <div key={index} className="bg-white p-3 rounded-xl flex gap-3">
              <Image src={img?.url || IMG} alt={product.name} width={80} height={80} className="rounded object-contain" />

              <div className="flex-1">
                <h3 className="text-sm font-semibold">{product.name}</h3>

                {variant && <div className="text-xs text-gray-500">{variant.name}</div>}

                <div className="text-sm font-bold mt-1">${price}</div>

                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => updateQty(index, Math.max(1, item.qty - 1))}
                    className="w-7 h-7 border rounded flex items-center justify-center"
                  >
                    <Minus size={12} />
                  </button>

                  <span>{item.qty}</span>

                  <button onClick={() => updateQty(index, item.qty + 1)} className="w-7 h-7 border rounded flex items-center justify-center">
                    <Plus size={12} />
                  </button>

                  <button onClick={() => removeFromCart(index)} className="ml-auto text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ✅ Recommended with your cart (complements, not same subcategory) */}
      <ProductRow title="Recommended with your cart" productIds={recoIds} />

      {/* CHECKOUT BAR */}
      <div className="fixed bottom-0 w-full bg-white border-t p-4 flex justify-between items-center">
        <span className="font-semibold">Total: ${total.toFixed(2)}</span>

        <button onClick={handleCheckout} className="bg-green-600 text-white px-6 py-2 rounded-md font-semibold">
          Checkout
        </button>
      </div>
    </div>
  );
}
