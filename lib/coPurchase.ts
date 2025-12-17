// lib/coPurchase.ts
import { coPurchaseCounts } from "@/data/store";

export function getAlsoBoughtFromCounts(productId: number, limit = 8, minCount = 1) {
  const scores = new Map<number, number>();

  for (const [key, count] of Object.entries(coPurchaseCounts || {})) {
    if (count < minCount) continue;

    const [aStr, bStr] = key.split("-");
    const a = Number(aStr);
    const b = Number(bStr);

    if (a === productId) scores.set(b, (scores.get(b) || 0) + count);
    if (b === productId) scores.set(a, (scores.get(a) || 0) + count);
  }

  return [...scores.entries()]
    .sort((x, y) => y[1] - x[1])
    .slice(0, limit)
    .map(([id]) => id);
}

export function getCartAlsoBought(cartProductIds: number[], limit = 8, minCount = 1) {
  const cartSet = new Set(cartProductIds);
  const scores = new Map<number, number>();

  for (const [key, count] of Object.entries(coPurchaseCounts || {})) {
    if (count < minCount) continue;

    const [aStr, bStr] = key.split("-");
    const a = Number(aStr);
    const b = Number(bStr);

    const aIn = cartSet.has(a);
    const bIn = cartSet.has(b);

    if (aIn && !bIn) scores.set(b, (scores.get(b) || 0) + count);
    if (bIn && !aIn) scores.set(a, (scores.get(a) || 0) + count);
  }

  return [...scores.entries()]
    .sort((x, y) => y[1] - x[1])
    .slice(0, limit)
    .map(([id]) => id);
}
