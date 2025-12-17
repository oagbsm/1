import Image from "next/image";
import Link from "next/link";
import TopSubcategoryCard from "@/components/TopSubcategoryCard";
import DebugScores from "@/components/DebugScores";
import HomeHeroCard from "@/components/HomeHeroCard";

import { categories, subcategories, products, productImages } from "@/data/store";

const IMG = "/example.png";

export default function HomePage() {
  return (
    <main className="bg-white min-h-screen text-black">
      {/* TOP CATEGORIES */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto flex gap-6 px-4 py-4 overflow-x-auto">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}   // ✅ FIXED
              className="flex flex-col items-center min-w-[90px]"
            >
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                <Image src={cat.img} alt={cat.name} width={32} height={32} />
              </div>
              <span className="text-sm mt-2 text-center">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* HERO BANNERS */}
      <section className="hidden md:block max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-3 gap-4">
<HomeHeroCard />
<TopSubcategoryCard />           <div className="h-48 bg-gray-100 rounded-xl" />
          <div className="h-48 bg-gray-100 rounded-xl" />
        </div>
      </section>

      {/* SUBCATEGORIES PER CATEGORY */}
      {categories.map((cat) => {
        const subs = subcategories.filter((s) => s.category_id === cat.id);
        if (!subs.length) return null;

        return <Section key={cat.id} title={cat.name} items={subs} />;
      })}

      {/* FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-lg font-semibold mb-4">Featured Products</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.slice(0, 8).map((p) => {
            const img = productImages.find((i) => i.product_id === p.id && i.is_primary);

            return (
              <Link
                key={p.id}
                href={`/product/${p.slug}`}
                className="border rounded-xl p-3 hover:shadow"
              >
                <Image
                  src={img?.url || IMG}
                  alt={p.name}
                  width={200}
                  height={200}
                  className="object-contain mx-auto"
                />

                <h3 className="text-sm mt-2 font-medium">{p.name}</h3>

                <p className="text-blue-600 font-semibold">${p.base_price}</p>

                {p.is_discounted && (
                  <span className="text-xs text-red-500">Discount</span>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      {/* ✅ DEBUG OVERLAY (NOT inside grids) */}
      {process.env.NODE_ENV === "development" && <DebugScores />}
    </main>
  );
}

/* ---------- SECTION ---------- */
function Section({
  title,
  items,
}: {
  title: string;
  items: { id: number; name: string; slug: string; img: string }[]; // ✅ FIXED
}) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/subcategory/${item.slug}`}
            className="flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center hover:bg-blue-200 transition">
              <Image src={item.img} alt={item.name} width={40} height={40} />
            </div>

            <span className="text-sm mt-2 leading-tight">{item.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
