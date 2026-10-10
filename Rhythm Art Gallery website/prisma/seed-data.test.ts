import { describe, expect, it } from "vitest";
import { seedRows } from "./seed-data";

describe("seedRows", () => {
  const { categories, products, events } = seedRows();

  it("maps every static record", () => {
    expect(categories).toHaveLength(5);
    expect(products).toHaveLength(26);
    expect(events).toHaveLength(5);
  });

  it("every product points at a seeded category and has one image", () => {
    const slugs = new Set(categories.map((c) => c.slug));
    for (const p of products) {
      expect(slugs.has(p.categorySlug), p.slug).toBe(true);
      expect(p.image.url).toContain(`/${p.categorySlug}/${p.slug}-1.jpg`);
    }
  });

  it("uses database enum names and keeps sale prices below price", () => {
    expect(new Set(categories.map((c) => c.group))).toEqual(new Set(["CLOTHING", "JEWELLERY", "BAGS"]));
    expect(events.every((e) => ["SELECTED", "EXHIBITED", "WORKSHOP", "GIVING_BACK"].includes(e.kind))).toBe(true);
    for (const p of products) if (p.salePrice !== null) expect(p.salePrice).toBeLessThan(p.price);
  });
});
