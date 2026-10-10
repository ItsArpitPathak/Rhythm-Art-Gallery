// Turns the placeholder catalogue in src/data into database rows. Pure (no DB), so it is unit-tested.
// The actual inserts live in prisma/seed.ts.
import { CATEGORIES, PRODUCTS, productImage } from "../src/data/catalog";
import { COMMUNITY_EVENTS } from "../src/data/community";

const GROUP = { Clothing: "CLOTHING", Jewellery: "JEWELLERY", Bags: "BAGS" } as const;
const KIND = { Selected: "SELECTED", Exhibited: "EXHIBITED", Workshop: "WORKSHOP", "Giving back": "GIVING_BACK" } as const;

export function seedRows() {
  return {
    categories: CATEGORIES.map((c, i) => ({
      slug: c.slug,
      name: c.name,
      tagline: c.tagline,
      group: GROUP[c.group],
      cover: c.cover,
      sortOrder: i,
    })),
    products: PRODUCTS.map((p) => ({
      slug: p.slug,
      name: p.name,
      categorySlug: p.category,
      price: p.price,
      salePrice: p.salePrice ?? null,
      isNew: p.isNew,
      material: p.material,
      description: p.description,
      sizes: p.sizes ?? [],
      image: { url: productImage(p), alt: p.name },
    })),
    events: COMMUNITY_EVENTS.map((e, i) => ({
      slug: e.slug,
      title: e.title,
      place: e.place,
      date: e.date,
      summary: e.summary,
      image: e.image,
      kind: KIND[e.kind],
      sortOrder: i,
    })),
  };
}
