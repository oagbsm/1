// lib/variantImage.ts

// Later you can add a real table. For now use a simple map.
// Key format: `${variantId}`
export const variantImageByVariantId: Record<string, string> = {
  // example:
  // "12": "/products/oil-1l.webp",
  // "13": "/products/oil-5l.webp",
};

export function getVariantImageUrl(variantId?: number | null) {
  if (!variantId) return null;
  return variantImageByVariantId[String(variantId)] || null;
}
