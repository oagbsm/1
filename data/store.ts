/* =========================
   CATEGORIES
========================= */
const categories = [
  { id: 1, name: "Groceries", slug: "groceries",img:"/products/alfanar.webp" },
  // { id: 2, name: "Electronics", slug: "electronics" },
  { id: 3, name: "Home & Kitchen", slug: "home-kitchen",img:"/products/cutlery.webp"  },
  { id: 4, name: "Personal Care", slug: "personal-care" ,img:"/products/nivea.webp" },
  { id: 5, name: "Baby Products", slug: "baby-products" ,img:"/products/nuna.webp" }
];

/* =========================
   SUBCATEGORIES
========================= */
type Subcategory = {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  img: string;

  // ✅ richer info
  description: string;
  hero_img?: string;
  keywords: string[];
  featured_product_ids?: number[];
};

const subcategories: Subcategory[] = [
  {
    id: 1,
    category_id: 1,
    name: "Rice & Grains",
    slug: "rice-grains",
    img: "/products/alfanar.webp",
    hero_img: "/products/alfanar.webp",
    description: "Basmati, grains, and everyday staples for home cooking.",
    keywords: ["rice", "basmati", "biryani", "sella", "pulao", "grain", "grains"],
    featured_product_ids: [1],
  },
  {
    id: 2,
    category_id: 1,
    name: "Cooking Oil",
    slug: "cooking-oil",
    img: "/products/oil.webp",
    hero_img: "/products/oil.webp",
    description: "High-quality oils for frying, cooking, and baking.",
    keywords: ["oil", "sunflower", "cooking oil", "frying"],
    featured_product_ids: [2],
  },
  {
    id: 5,
    category_id: 3,
    name: "Cookware",
    slug: "cookware",
    img: "/products/cutlery.webp",
    hero_img: "/products/cutlery.webp",
    description: "Pans, pots, and kitchen essentials for daily use.",
    keywords: ["pan", "cookware", "frying pan", "pot", "kitchen"],
    featured_product_ids: [5],
  },
  {
    id: 6,
    category_id: 4,
    name: "Skin Care",
    slug: "skin-care",
    img: "/products/nivea.webp",
    hero_img: "/products/nivea.webp",
    description: "Skin and personal care essentials for the whole family.",
    keywords: ["skin", "lotion", "cream", "soap", "nivea", "moisturizer"],
    featured_product_ids: [6],
  },
  {
    id: 7,
    category_id: 5,
    name: "Diapers",
    slug: "baby-diapers",
    img: "/products/nuna.webp",
    hero_img: "/products/nuna.webp",
    description: "Comfortable, absorbent diapers for babies and toddlers.",
    keywords: ["diaper", "diapers", "baby", "nappy", "pampers", "wipes"],
    featured_product_ids: [7],
  },
];
const subcategoryKeywords: Record<number, string[]> = Object.fromEntries(
  subcategories.map((s) => [s.id, s.keywords])
);

/* =========================
   BRANDS
========================= */
const brands = [
  { id: 1, name: "Baraka", slug: "baraka" },
  { id: 2, name: "Samsung", slug: "samsung" },
  { id: 3, name: "Apple", slug: "apple" },
  { id: 4, name: "Dettol", slug: "dettol" },
  { id: 5, name: "Pampers", slug: "pampers" },
  { id: 6, name: "Local Harvest", slug: "local-harvest" }
];

/* =========================
   PRODUCTS
========================= */
const products = [
  {
    id: 1,
    name: "Basmati Rice 5kg",
    slug: "basmati-rice-5kg",
    long_description:
      "Premium long-grain basmati rice with rich aroma, perfect for daily meals and special occasions.",
    category_id: 1,
    subcategory_id: 1,
    brand_id: 6,
    is_discounted: true,
    base_price: 18.5
  },
  {
    id: 2,
    name: "Sunflower Cooking Oil 3L",
    slug: "sunflower-cooking-oil-3l",
    long_description:
      "Refined sunflower oil suitable for frying, cooking, and baking. Light and healthy.",
    category_id: 1,
    subcategory_id: 2,
    brand_id: 1,
    is_discounted: false,
    base_price: 11.0
  },
  {
    id: 3,
    name: "Samsung Galaxy A15",
    slug: "samsung-galaxy-a15",
    long_description:
      "Affordable smartphone with long battery life, large display, and reliable performance.",
    category_id: 2,
    subcategory_id: 3,
    brand_id: 2,
    is_discounted: true,
    base_price: 165
  },
  {
    id: 4,
    name: "iPhone 13 128GB",
    slug: "iphone-13-128gb",
    long_description:
      "Powerful Apple smartphone with advanced camera system and smooth performance.",
    category_id: 2,
    subcategory_id: 3,
    brand_id: 3,
    is_discounted: false,
    base_price: 720
  },
  {
    id: 5,
    name: "Non-Stick Frying Pan 28cm",
    slug: "non-stick-frying-pan-28cm",
    long_description:
      "Durable non-stick frying pan suitable for gas and electric stoves.",
    category_id: 3,
    subcategory_id: 5,
    brand_id: 6,
    is_discounted: true,
    base_price: 24
  },
  {
    id: 6,
    name: "Dettol Antibacterial Soap 4 Pack",
    slug: "dettol-antibacterial-soap-4-pack",
    long_description:
      "Trusted antibacterial soap for everyday family protection.",
    category_id: 4,
    subcategory_id: 6,
    brand_id: 4,
    is_discounted: false,
    base_price: 4.5
  },
  {
    id: 7,
    name: "Pampers Baby Diapers Size 4 (64 pcs)",
    slug: "pampers-baby-diapers-size-4-64pcs",
    long_description:
      "Soft, absorbent diapers providing up to 12 hours of protection.",
    category_id: 5,
    subcategory_id: 7,
    brand_id: 5,
    is_discounted: true,
    base_price: 32
  }
];

/* =========================
   PRODUCT VARIANTS
========================= */
const productVariants = [
  { id: 1, product_id: 1, name: "5kg Bag", sku: "RICE-5KG", price: 18.5, stock: 120 },
  { id: 2, product_id: 1, name: "10kg Bag", sku: "RICE-10KG", price: 35, stock: 60 },

  { id: 3, product_id: 3, name: "4GB / 128GB", sku: "A15-4-128", price: 165, stock: 35 },
  { id: 4, product_id: 3, name: "6GB / 128GB", sku: "A15-6-128", price: 185, stock: 20 },

  { id: 5, product_id: 7, name: "Size 4", sku: "PAMP-S4", price: 32, stock: 80 },
  { id: 6, product_id: 7, name: "Size 5", sku: "PAMP-S5", price: 34, stock: 50 }
];

/* =========================
   PRODUCT IMAGES
========================= */
const productImages = [
  { id: 1, product_id: 1, url: "/products/alfanar.webp", is_primary: true },
  { id: 2, product_id: 1, url: "/products/alfanar.webp", is_primary: false },

  { id: 3, product_id: 3, url: "/images/a15-front.jpg", is_primary: true },
  { id: 4, product_id: 3, url: "/images/a15-back.jpg", is_primary: false },

  { id: 5, product_id: 7, url: "/products/nuna.webp", is_primary: true },
    { id: 6, product_id: 2, url: "/products/oil.webp", is_primary: true },
    { id: 7, product_id: 5, url: "/products/cutlery.webp", is_primary: true }

];

/* =========================
   INVENTORY
========================= */
const inventory = [
  { id: 1, variant_id: 1, quantity: 1200, warehouse: "A1" },
  { id: 2, variant_id: 2, quantity: 60, warehouse: "A2" },
  { id: 3, variant_id: 3, quantity: 35, warehouse: "B1" },
  { id: 4, variant_id: 4, quantity: 20, warehouse: "B2" },
  { id: 5, variant_id: 5, quantity: 80, warehouse: "C1" },
  { id: 6, variant_id: 6, quantity: 50, warehouse: "C2" }
];

/* =========================
   ORDERS (New)
========================= */
type CartItem = {
  product_id: number;
  variant_id?: number | null;
  qty: number;
};

type Order = {
  id: number;
  items: CartItem[];
  total: number;
  date: string;
};

const orders: Order[] = [];
type CoPurchaseCounts = Record<string, number>;
const coPurchaseCounts: CoPurchaseCounts = {};
/* =========================
   CHECKOUT FUNCTION
========================= */
function checkoutCart(cartItems: CartItem[]): Order {
  const total = cartItems.reduce((sum, item) => {
    const product = products.find(p => p.id === item.product_id);
    const variant = productVariants.find(v => v.id === item.variant_id);
    const price = variant?.price ?? product?.base_price ?? 0;
    return sum + price * item.qty;
  }, 0);
  // ✅ Update co-purchase counts


  const order: Order = {
    id: orders.length + 1,
    items: cartItems,
    total,
    date: new Date().toISOString()
  };

  // Push order to orders array
  orders.push(order);
  const ids = [...new Set(cartItems.map((i) => i.product_id))].sort((a, b) => a - b);

  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      const a = ids[i];
      const b = ids[j];
      const key = `${a}-${b}`;
      coPurchaseCounts[key] = (coPurchaseCounts[key] || 0) + 1;
    }
  }
  // Reduce inventory
   // Reduce inventory (variant stock + inventory table)
  cartItems.forEach(item => {
    if (!item.variant_id) return;

    const variant = productVariants.find(v => v.id === item.variant_id);
    if (variant) variant.stock = Math.max(0, variant.stock - item.qty);

    const inv = inventory.find(x => x.variant_id === item.variant_id);
    if (inv) inv.quantity = Math.max(0, inv.quantity - item.qty);
  });


  return order;
}

/* =========================
   EXPORTS

========================= */
/* =========================
   SUBCATEGORY KEYWORDS (Search Intelligence)
========================= */


export {
  categories,
  subcategories,
  brands,
  products,
  productVariants,
  productImages,
  inventory,
  orders,
  checkoutCart,
  subcategoryKeywords,
  coPurchaseCounts
};

