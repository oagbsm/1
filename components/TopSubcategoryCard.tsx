"use client";

import { useEffect, useMemo, useState } from "react";
import {
  loadUserProfile,
  createDefaultUserProfile,
  UserProfile,
} from "@/data/user";
import { subcategories } from "@/data/store";

export default function TopSubcategoryCard() {
  const [user, setUser] = useState<UserProfile>(() =>
    createDefaultUserProfile()
  );

  useEffect(() => {
    setUser(loadUserProfile());
  }, []);

  const topSubcategory = useMemo(() => {
    const scores = user?.subcategoryInterestScores ?? {}; // ✅ safe default
    const entries = Object.entries(scores);
    if (!entries.length) return null;

    entries.sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0));
    const id = Number(entries[0][0]);
    return subcategories.find((s) => s.id === id) || null;
  }, [user]);

  if (!topSubcategory) return null;

  return (
    <div className="h-48 rounded-xl bg-blue-50 border flex items-center p-6">
      <div>
        <p className="text-xs text-blue-600 font-semibold mb-2">
          Recommended for you
        </p>
        <h3 className="text-xl font-bold text-black">
          {topSubcategory.name}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Based on your recent searches
        </p>
      </div>
    </div>
  );
}
