export type UserProfile = {
  user_id: string;

  // ONLY scores we keep in localStorage
  productInterestScores: Record<string, number>;      // product_id -> score
  subcategoryInterestScores: Record<string, number>;  // subcategory_id -> score
};

export function createDefaultUserProfile(): UserProfile {
  const id =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);

  return {
    user_id: id,
    productInterestScores: {},
    subcategoryInterestScores: {},
  };
}

// ✅ strips old fields from previous versions
function normalizeUserProfile(raw: any): UserProfile {
  const base = createDefaultUserProfile();
  return {
    user_id: raw?.user_id ?? base.user_id,
    productInterestScores: raw?.productInterestScores ?? raw?.interestScores ?? {},
    subcategoryInterestScores:
      raw?.subcategoryInterestScores ?? raw?.subcategoryScores ?? raw?.segmentScores ?? {},
  };
}

export function loadUserProfile(): UserProfile {
  if (typeof window === "undefined") return createDefaultUserProfile();
  const saved = localStorage.getItem("userProfile");
  if (!saved) return createDefaultUserProfile();

  const normalized = normalizeUserProfile(JSON.parse(saved));
  // ✅ overwrite localStorage with stripped structure
  localStorage.setItem("userProfile", JSON.stringify(normalized));
  return normalized;
}

export function saveUserProfile(user: UserProfile) {
  if (typeof window === "undefined") return;

  // ✅ ensure we never store extra keys
  const cleaned: UserProfile = {
    user_id: user.user_id,
    productInterestScores: user.productInterestScores,
    subcategoryInterestScores: user.subcategoryInterestScores,
  };

  localStorage.setItem("userProfile", JSON.stringify(cleaned));
}
