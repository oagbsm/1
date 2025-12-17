"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { products, productImages, subcategoryKeywords } from "@/data/store";
import {
  UserProfile,
  loadUserProfile,
  saveUserProfile,
  createDefaultUserProfile,
} from "@/data/user";

const IMG = "/example.png";

// +3 subcategory based on query keywords
function boostSubcategoryFromQuery(profile: UserProfile, query: string) {
  const q = query.toLowerCase().trim();
  if (!q) return profile;

  const updated: UserProfile = {
    ...profile,
    subcategoryInterestScores: { ...profile.subcategoryInterestScores },
  };

  for (const [subId, keywords] of Object.entries(subcategoryKeywords)) {
    if (keywords.some((k) => q.includes(k))) {
      updated.subcategoryInterestScores[subId] =
        (updated.subcategoryInterestScores[subId] || 0) + 3;
      break;
    }
  }

  return updated;
}

// +3 subcategory from a known subcategory_id (click)
function boostSubcategoryById(profile: UserProfile, subcategoryId: number) {
  const updated: UserProfile = {
    ...profile,
    subcategoryInterestScores: { ...profile.subcategoryInterestScores },
  };

  const key = String(subcategoryId);
  updated.subcategoryInterestScores[key] =
    (updated.subcategoryInterestScores[key] || 0) + 3;

  return updated;
}

// +1 to each product in search results
function boostProductsFromSearch(profile: UserProfile, items: { id: number }[]) {
  const updated: UserProfile = {
    ...profile,
    productInterestScores: { ...profile.productInterestScores },
  };

  items.slice(0, 20).forEach((p) => {
    const key = String(p.id);
    updated.productInterestScores[key] =
      (updated.productInterestScores[key] || 0) + 1;
  });

  return updated;
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [user, setUser] = useState<UserProfile>(() => createDefaultUserProfile());

  useEffect(() => {
    setUser(loadUserProfile());
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(q));
  }, [query]);

  const handleSubmitSearch = () => {
    if (!query.trim()) return;

    setUser((prev) => {
      let updated = prev;

      updated = boostSubcategoryFromQuery(updated, query); // +3
      updated = boostProductsFromSearch(updated, results); // +1/product

      saveUserProfile(updated);
      return updated;
    });
  };

  const handleClickResult = (productId: number) => {
    setUser((prev) => {
      const updated: UserProfile = {
        ...prev,
        productInterestScores: { ...prev.productInterestScores },
        subcategoryInterestScores: { ...prev.subcategoryInterestScores },
      };

      // +2 product
      updated.productInterestScores[String(productId)] =
        (updated.productInterestScores[String(productId)] || 0) + 2;

      // +3 subcategory from product
      const p = products.find((x) => x.id === productId);
      if (p?.subcategory_id) {
        const updated2 = boostSubcategoryById(updated, p.subcategory_id);
        saveUserProfile(updated2);
        return updated2;
      }

      saveUserProfile(updated);
      return updated;
    });
  };

  return (
    <div className="relative w-full max-w-xl">
      <div className="bg-blue-600 rounded-full flex items-center px-4">
        <span className="mr-2">🔍</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmitSearch()}
          placeholder="Search products"
          className="bg-transparent w-full py-2 text-white placeholder-blue-200 outline-none"
        />
      </div>

      {query && (
        <div className="absolute mt-2 w-full bg-white rounded-xl shadow-lg max-h-96 overflow-y-auto z-50">
          {results.length === 0 ? (
            <p className="p-4 text-gray-500">No products found</p>
          ) : (
            results.map((p) => {
              const img = productImages.find(
                (i) => i.product_id === p.id && i.is_primary
              );

              return (
                <Link
                  key={p.id}
                  href={`/product/${p.slug}`}
                  onClick={() => {
                    handleClickResult(p.id);
                    setQuery("");
                  }}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50"
                >
                  <Image src={img?.url || IMG} alt={p.name} width={40} height={40} />
                  <span className="text-sm text-black">{p.name}</span>
                </Link>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
