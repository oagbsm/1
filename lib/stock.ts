// lib/stock.ts
import { productVariants } from "@/data/store";

export function getAvailableStock(productId: number, variantId?: number | null) {
  // If product has variants, show selected variant stock
  if (variantId) {
    const v = productVariants.find((x) => x.id === variantId);
    return typeof v?.stock === "number" ? v.stock : null;
  }

  // If product has variants but none selected, show sum of stocks
  const vars = productVariants.filter((v) => v.product_id === productId);
  if (vars.length) {
    return vars.reduce((sum, v) => sum + (v.stock || 0), 0);
  }

  // No variants: no reliable stock in your data right now
  return null;
}
