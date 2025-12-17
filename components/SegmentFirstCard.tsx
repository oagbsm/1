"use client";

import { useEffect, useMemo, useState } from "react";
import {
  loadUserProfile,
  createDefaultUserProfile,
  UserProfile
} from "@/data/user";

import { subcategories } from "@/data/store";

export default function SegmentFirstCard() {
  const [user, setUser] = useState<UserProfile>(() =>
    createDefaultUserProfile()
  );

  // Load profile on mount
  useEffect(() => {
    setUser(loadUserProfile());
  }, []);

  // Pick highest‑interest SUBCATEGORY (instead of segments)
  const topSubcategory = useMemo(() => {
    const scores = user.subcategoryInterestScores || {};
    const entries = Object.entries(scores);

    if (!entries.length) return null;

    // Sort highest → lowest
    entries.sort((a, b) => b[1] - a[1]);

    const topId = Number(entries[0][0]);

    return subcategories.find((s) => s.id === topId) || null;
  }, [user.subcategoryInterestScores]);

  if (!topSubcategory) return null;

  return (
    <div className="h-48 rounded-xl bg-blue-50 border overflow-hidden flex items-center p-6">
      <div>
        <p className="text-xs text-blue-600 font-semibold mb-2">
          Recommended for you
        </p>

        <h3 className="text-xl font-bold text-black">
          {topSubcategory.name}
        </h3>

        <p className="text-sm text-gray-600 mt-1">
          Based on your activity, this category is highlighted.
        </p>
      </div>
    </div>
  );
}
