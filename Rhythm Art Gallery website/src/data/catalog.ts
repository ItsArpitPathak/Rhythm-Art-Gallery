// Placeholder catalogue for the concept site. Replaced by the database in stage 4.
// Images live in public/images/products/<category>/<slug>-1.jpg (see public/images/README.md).

export type CategorySlug = "saris" | "suits" | "jewellery" | "handbags" | "purses";

export type Category = {
  slug: CategorySlug;
  name: string;
  tagline: string;
  group: "Clothing" | "Jewellery" | "Bags";
  cover: string;
};

export type Product = {
  slug: string;
  name: string;
  category: CategorySlug;
  price: number; // rupees, GST-inclusive
  salePrice?: number;
  isNew: boolean;
  material: string;
  description: string;
  sizes?: string[];
};

export const CATEGORIES: Category[] = [
  { slug: "saris", name: "Saris", tagline: "Silk, zari and woven stories", group: "Clothing", cover: "/images/products/saris/violet-kanchipuram-saree-1.jpg" },
  { slug: "suits", name: "Suits", tagline: "Sharara, salwar and kurta sets", group: "Clothing", cover: "/images/products/suits/rani-pink-sharara-suit-1.jpg" },
  { slug: "jewellery", name: "Jewellery", tagline: "Kundan, gold tone and drops", group: "Jewellery", cover: "/images/products/jewellery/kundan-bridal-necklace-set-1.jpg" },
  { slug: "handbags", name: "Handbags", tagline: "Everyday and occasion carry", group: "Bags", cover: "/images/products/handbags/scarlet-structured-handbag-1.jpg" },
  { slug: "purses", name: "Purses", tagline: "Clutches and small pouches", group: "Bags", cover: "/images/products/purses/rosewood-croc-clutch-1.jpg" },
];

const SARI_SIZES = ["Free size"];
const SUIT_SIZES = ["S", "M", "L", "XL"];

export const PRODUCTS: Product[] = [
  { slug: "sage-silk-kanjivaram-saree", name: "Sage Silk Kanjivaram Saree", category: "saris", price: 18500, isNew: true, material: "Pure silk", description: "Soft sage silk with a woven zari border. Drapes with weight and shine.", sizes: SARI_SIZES },
  { slug: "copper-banarasi-saree", name: "Copper Banarasi Saree", category: "saris", price: 14200, salePrice: 12400, isNew: false, material: "Banarasi silk blend", description: "Copper tone Banarasi with a rich pallu and fine brocade.", sizes: SARI_SIZES },
  { slug: "rose-zari-saree", name: "Rose Zari Saree", category: "saris", price: 9800, isNew: true, material: "Art silk", description: "Rose and orange saree with gold zari work, light enough for long events.", sizes: SARI_SIZES },
  { slug: "violet-kanchipuram-saree", name: "Violet Kanchipuram Saree", category: "saris", price: 22500, isNew: true, material: "Kanchipuram silk", description: "Deep violet with a gold woven body. A wedding-season favourite.", sizes: SARI_SIZES },
  { slug: "plum-zari-border-saree", name: "Plum Zari Border Saree", category: "saris", price: 8600, isNew: false, material: "Cotton silk", description: "Plum body with a broad zari border. Easy to wear, easy to love.", sizes: SARI_SIZES },
  { slug: "parrot-green-wedding-saree", name: "Parrot Green Wedding Saree", category: "saris", price: 24000, salePrice: 21500, isNew: false, material: "Silk with zari", description: "Parrot green and pink with heavy gold work, made for the mandap.", sizes: SARI_SIZES },

  { slug: "rani-pink-sharara-suit", name: "Rani Pink Sharara Suit", category: "suits", price: 7800, isNew: true, material: "Georgette", description: "Rani pink sharara set with a gota-trimmed kurta and net dupatta.", sizes: SUIT_SIZES },
  { slug: "mist-green-chikankari-sharara", name: "Mist Green Chikankari Sharara", category: "suits", price: 9400, isNew: true, material: "Cotton with chikankari", description: "Pale green chikankari embroidery with a flowing sharara and dupatta.", sizes: SUIT_SIZES },
  { slug: "scarlet-embroidered-kurta-set", name: "Scarlet Embroidered Kurta Set", category: "suits", price: 5200, salePrice: 4600, isNew: false, material: "Cotton silk", description: "Scarlet kurta with neckline embroidery and a printed dupatta.", sizes: SUIT_SIZES },
  { slug: "royal-blue-silk-suit", name: "Royal Blue Silk Suit", category: "suits", price: 6900, isNew: false, material: "Silk blend", description: "Royal blue with hand-worked cuffs and a soft drape.", sizes: SUIT_SIZES },
  { slug: "garden-green-printed-suit", name: "Garden Green Printed Suit", category: "suits", price: 4300, isNew: false, material: "Cotton", description: "Garden print salwar suit for days that run long.", sizes: SUIT_SIZES },
  { slug: "marigold-yoke-kurta-dress", name: "Marigold Yoke Kurta Dress", category: "suits", price: 3600, isNew: true, material: "Rayon", description: "Marigold tiered kurta dress with an embroidered yoke.", sizes: SUIT_SIZES },

  { slug: "ruby-drop-earrings", name: "Ruby Drop Earrings", category: "jewellery", price: 2400, isNew: true, material: "Gold tone, stone", description: "Teardrop earrings with ruby tone stones and clear crystals." },
  { slug: "kundan-bridal-necklace-set", name: "Kundan Bridal Necklace Set", category: "jewellery", price: 16500, isNew: true, material: "Kundan, gold tone", description: "Layered kundan necklace with maang tikka and earrings." },
  { slug: "gold-maang-tikka-choker-set", name: "Gold Maang Tikka & Choker Set", category: "jewellery", price: 11800, salePrice: 9900, isNew: false, material: "Gold tone, pearl", description: "Choker, tikka and earrings in antique gold tone with pearl drops." },
  { slug: "temple-gold-haar", name: "Temple Gold Haar", category: "jewellery", price: 13200, isNew: false, material: "Temple gold tone", description: "Long haar in temple style with fine detailing." },
  { slug: "bridal-gold-choker-set", name: "Bridal Gold Choker Set", category: "jewellery", price: 18000, isNew: false, material: "Gold tone, stone", description: "Bridal choker with matching earrings, heavy on shine." },

  { slug: "chestnut-woven-tote", name: "Chestnut Woven Tote", category: "handbags", price: 4800, isNew: true, material: "Vegan leather", description: "Woven chestnut tote with a chain detail. Fits a full day." },
  { slug: "marigold-wicker-top-handle-bag", name: "Marigold Wicker Top-Handle Bag", category: "handbags", price: 3900, isNew: true, material: "Wicker, leather trim", description: "Handwoven wicker bag in marigold with a leather handle." },
  { slug: "scarlet-structured-handbag", name: "Scarlet Structured Handbag", category: "handbags", price: 6200, isNew: false, material: "Leather", description: "Structured handbag in scarlet with a metal clasp." },
  { slug: "ivory-classic-handbag", name: "Ivory Classic Handbag", category: "handbags", price: 7400, isNew: false, material: "Leather", description: "Ivory handbag with gold accents. Pairs with every saree." },
  { slug: "tan-crossbody-saddle-bag", name: "Tan Crossbody Saddle Bag", category: "handbags", price: 3200, salePrice: 2800, isNew: false, material: "Vegan leather", description: "Tan saddle bag with an adjustable crossbody strap." },
  { slug: "slate-satchel", name: "Slate Satchel", category: "handbags", price: 3500, isNew: false, material: "Vegan leather", description: "Slate grey satchel with two buckle closures." },

  { slug: "silver-quilted-clutch", name: "Silver Quilted Clutch", category: "purses", price: 1800, isNew: true, material: "Metallic faux leather", description: "Quilted silver clutch with floral charm accents." },
  { slug: "rosewood-croc-clutch", name: "Rosewood Croc Clutch", category: "purses", price: 1500, isNew: true, material: "Embossed faux leather", description: "Rosewood clutch with a croc-textured finish." },
  { slug: "pink-studded-clutch", name: "Pink Studded Clutch", category: "purses", price: 1200, salePrice: 999, isNew: false, material: "Studded faux leather", description: "Bright pink studded clutch for evening." },
];

export const productImage = (p: Product, n = 1) => `/images/products/${p.category}/${p.slug}-${n}.jpg`;
export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
export const getCategory = (slug: string) => CATEGORIES.find((c) => c.slug === slug);
export const productsIn = (c: CategorySlug) => PRODUCTS.filter((p) => p.category === c);
export const newArrivals = () => PRODUCTS.filter((p) => p.isNew);
