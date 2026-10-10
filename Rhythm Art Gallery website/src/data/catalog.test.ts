import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { CATEGORIES, PRODUCTS, productImage } from "./catalog";

describe("catalogue data", () => {
  it("has unique product slugs", () => {
    expect(new Set(PRODUCTS.map((p) => p.slug)).size).toBe(PRODUCTS.length);
  });

  it("every product belongs to a known category and has a positive price", () => {
    const slugs = new Set(CATEGORIES.map((c) => c.slug));
    for (const p of PRODUCTS) {
      expect(slugs.has(p.category), p.slug).toBe(true);
      expect(p.price).toBeGreaterThan(0);
      if (p.salePrice) expect(p.salePrice).toBeLessThan(p.price);
    }
  });

  it("every image file exists", () => {
    const pub = join(process.cwd(), "public");
    for (const p of PRODUCTS) expect(existsSync(join(pub, productImage(p))), p.slug).toBe(true);
    for (const c of CATEGORIES) expect(existsSync(join(pub, c.cover)), c.slug).toBe(true);
  });
});
