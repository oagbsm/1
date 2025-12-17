"use client";

import { useEffect, useState } from "react";
import { loadUserProfile, createDefaultUserProfile, UserProfile } from "@/data/user";
import { products, subcategories } from "@/data/store";

export default function DebugScores() {
  const [user, setUser] = useState<UserProfile>(() => createDefaultUserProfile());

  useEffect(() => {
    setUser(loadUserProfile());

    // update live if localStorage changes (optional)
    const onStorage = () => setUser(loadUserProfile());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const productScores = user.productInterestScores ?? {};
  const subScores = user.subcategoryInterestScores ?? {};

  const topProducts = Object.entries(productScores)
    .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))
    .slice(0, 10);

  const topSubs = Object.entries(subScores)
    .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))
    .slice(0, 10);

  return (
    <div className="fixed bottom-4 right-4 w-[360px] bg-white border rounded-xl shadow-lg p-4 text-black z-[9999]">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">Debug Scores</h3>
        <button
          className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
          onClick={() => {
            localStorage.removeItem("userProfile");
            setUser(createDefaultUserProfile());
          }}
        >
          Reset
        </button>
      </div>

      <div className="mb-3">
        <div className="text-xs font-semibold text-gray-600 mb-1">
          Subcategory Interest Scores
        </div>
        {topSubs.length === 0 ? (
          <div className="text-xs text-gray-500">No subcategory scores yet</div>
        ) : (
          <ul className="text-xs space-y-1">
            {topSubs.map(([id, score]) => {
              const sub = subcategories.find((s) => s.id === Number(id));
              return (
                <li key={id} className="flex justify-between gap-2">
                  <span className="truncate">{sub?.name ?? `Subcategory ${id}`}</span>
                  <span className="font-mono">{score}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div>
        <div className="text-xs font-semibold text-gray-600 mb-1">
          Product Interest Scores
        </div>
        {topProducts.length === 0 ? (
          <div className="text-xs text-gray-500">No product scores yet</div>
        ) : (
          <ul className="text-xs space-y-1">
            {topProducts.map(([id, score]) => {
              const p = products.find((x) => x.id === Number(id));
              return (
                <li key={id} className="flex justify-between gap-2">
                  <span className="truncate">{p?.name ?? `Product ${id}`}</span>
                  <span className="font-mono">{score}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
