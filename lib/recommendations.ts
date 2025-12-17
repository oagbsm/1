// lib/recommendations.ts
import { orders, products } from "@/data/store";
import { coPurchaseCounts } from "@/data/store";


type CartItem = { product_id: number; qty: number };

// Build co-purchase counts from your orders array
function buildCoPurchaseMap() {
  const map = new Map<number, Map<number, number>>();

  for (const order of orders) {
    const ids = order.items.map((i) => i.product_id);

    for (let i = 0; i < ids.length; i++) {
      for (let j = 0; j < ids.length; j++) {
        if (i === j) continue;
        const a = ids[i];
        const b = ids[j];

        if (!map.has(a)) map.set(a, new Map());
        const inner = map.get(a)!;
        inner.set(b, (inner.get(b) || 0) + 1);
      }
    }
  }
  return map;
}

export function getAlsoBought(productId: number, limit = 8): number[] {
  const co = buildCoPurchaseMap();
  const inner = co.get(productId);
  if (!inner) return [];

  return [...inner.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => id);
}

export function getCartRecommendations(
  cartItems: CartItem[],
  limit = 8
): number[] {
  const cartProductIds = new Set(cartItems.map((c) => c.product_id));

  // subcategories already in cart (so we avoid recommending same subcategory)
  const cartSubIds = new Set<number>();
  for (const c of cartItems) {
    const p = products.find((x) => x.id === c.product_id);
    if (p?.subcategory_id) cartSubIds.add(p.subcategory_id);
  }

  const co = buildCoPurchaseMap();
  const score = new Map<number, number>();

  for (const c of cartItems) {
    const inner = co.get(c.product_id);
    if (!inner) continue;

    for (const [otherId, count] of inner.entries()) {
      if (cartProductIds.has(otherId)) continue;

      const other = products.find((p) => p.id === otherId);
      if (!other) continue;

      // ✅ IMPORTANT: avoid recommending same subcategory already in cart
      if (other.subcategory_id && cartSubIds.has(other.subcategory_id)) continue;

      score.set(otherId, (score.get(otherId) || 0) + count);
    }
  }

  // If no co-purchase data yet (early stage), fallback to “other subcategories”
  if (score.size === 0) {
    const fallback = products
      .filter(
        (p) =>
          !cartProductIds.has(p.id) &&
          (!p.subcategory_id || !cartSubIds.has(p.subcategory_id))
      )
      .slice(0, limit)
      .map((p) => p.id);

    return fallback;
  }

  return [...score.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => id);
}
export function getAlsoBoughtFromCoPurchases(productId: number, limit = 8, minCount = 1) {
  const scores: Record<number, number> = {};

  for (const [key, count] of Object.entries(coPurchaseCounts)) {
    if (count < minCount) continue;

    const [aStr, bStr] = key.split("-");
    const a = Number(aStr);
    const b = Number(bStr);

    if (a === productId) scores[b] = (scores[b] || 0) + count;
    if (b === productId) scores[a] = (scores[a] || 0) + count;
  }

  return Object.entries(scores)
    .sort((x, y) => y[1] - x[1])
    .slice(0, limit)
    .map(([id]) => Number(id));
}

