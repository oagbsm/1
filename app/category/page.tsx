"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart, SlidersHorizontal, ArrowLeft } from "lucide-react";

export default function CategoryPage() {
  const router = useRouter();
  const products = [
    {
      id: 1,
      name: "Bingo Masala Tadka Tedhe Medhe",
      price: "₹19.00",
      oldPrice: "₹20.00",
      off: "5% Off",
      weight: "75 g",
      img: "/example.png",
    },
    {
      id: 2,
      name: "Kurkure Masala Munch",
      price: "₹10.00",
      weight: "36 g",
      img: "/example.png",
    },
    {
      id: 3,
      name: "Bingo Original Chilli Sprinkled",
      price: "₹33.00",
      off: "34% Off",
      weight: "85 g",
      img: "/example.png",
    },
    {
      id: 4,
      name: "Bingo Mad Angles Achaari Masti",
      price: "₹33.00",
      off: "34% Off",
      weight: "117 g",
      img: "/example.png",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#0A7C9E] px-3 py-2 text-white">
        <div className="flex items-center gap-2">
          <ArrowLeft size={20} className="cursor-pointer" onClick={() => router.push("/")} />
          <input
            placeholder="Search"
            className="flex-1 rounded-md px-3 py-2 text-sm text-black"
          />
          <div className="relative">
            <div className="absolute -top-1 -right-1 bg-red-500 text-[10px] px-1 rounded-full">8</div>
            🛒
          </div>
        </div>
        <div className="text-xs mt-2">📍 Mumbai 400020</div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between px-3 py-2 bg-white border-b text-sm">
        <span className="font-semibold">Search Results</span>
        <div className="flex gap-3 text-gray-600">
          <div className="flex items-center gap-1">↕ Sort</div>
          <div className="flex items-center gap-1"><SlidersHorizontal size={14}/> Filter</div>
        </div>
      </div>

      {/* Content */}
      <div className="flex">
        {/* Left Categories */}
        <div className="w-20 bg-white border-r text-xs">
          {[
            { name: "All", img: "/example.png" },
            { name: "Chips & Corn", img: "/example.png" },
            { name: "Namkeen", img: "/example.png" },
            { name: "Roasted Chana", img: "/example.png" },
            { name: "Sweet", img: "/example.png" },
          ].map((c,i)=> (
            <div
              key={i}
              className={`px-2 py-3 flex flex-col items-center gap-1 text-black ${i===0?"bg-blue-50 font-semibold":""}`}
            >
              <Image
                src={c.img}
                alt={c.name}
                width={28}
                height={28}
                className="object-contain"
              />
              <span className="text-[10px] text-center leading-tight">{c.name}</span>
            </div>
          ))}
        </div>

        {/* Products */}
        <div className="grid grid-cols-2 gap-3 p-3 flex-1">
          {products.map(p => (
            <div key={p.id} className="bg-white rounded-xl shadow-sm p-2 relative">
              <Heart className="absolute right-2 top-2 text-gray-400" size={16}/>
              <Image src={p.img} alt="product" width={150} height={150} className="mx-auto" />
              <div className="text-xs text-gray-700 mt-1 line-clamp-2">{p.name}</div>
              <div className="text-[11px] text-gray-500">{p.weight}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-semibold">{p.price}</span>
                {p.oldPrice && <span className="line-through text-xs text-gray-400">{p.oldPrice}</span>}
              </div>
              {p.off && <div className="text-red-500 text-xs">{p.off}</div>}
              <button className="mt-2 w-full border border-green-600 text-green-600 rounded-md text-sm py-1">
                Add +
              </button>
              <div className="mt-1 text-[11px] text-center text-green-600 bg-green-50 rounded">
                ⚡ Quick
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 w-full bg-white border-t flex justify-around py-2 text-xs">
        <div>🏠 Home</div>
        <div>📂 Categories</div>
        <div>❤️ Wishlist</div>
        <div>📦 Orders</div>
      </div>
    </div>
  );
}
