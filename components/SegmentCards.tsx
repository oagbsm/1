"use client";

import { useEffect, useMemo, useState } from "react";
import { loadUserProfile, createDefaultUserProfile, UserProfile } from "@/data/user";
import { segments } from "@/data/store";

export default function SegmentFirstCard() {
  const [user, setUser] = useState<UserProfile>(() => createDefaultUserProfile());

  useEffect(() => {
    setUser(loadUserProfile());
  }, []);

  const topSegment = useMemo(() => {
    const entries = Object.entries(user.segmentScores || {});
    if (!entries.length) return null;

    entries.sort((a, b) => b[1] - a[1]);
    const topId = entries[0][0];
    return segments.find((s) => s.id === topId) || null;
  }, [user.segmentScores]);

  if (!topSegment) return null;

  return (
    <div className="h-48 rounded-xl bg-blue-50 border overflow-hidden flex items-center p-6">
      <div>
        <p className="text-xs text-blue-600 font-semibold mb-2">
          Recommended for you
        </p>
        <h3 className="text-xl font-bold text-black">
          {topSegment.name}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Based on your searches, we’re highlighting this category.
        </p>
      </div>
    </div>
  );
}
