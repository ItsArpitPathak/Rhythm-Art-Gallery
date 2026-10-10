// Read-only check that the seeded database matches the static data. Skipped when DATABASE_URL is not set
// (for example in CI without a database). Run `npm run db:seed` first.
import { describe, expect, it } from "vitest";
import { seedRows } from "./seed-data";

try {
  process.loadEnvFile();
} catch {
  /* no .env */
}

describe.skipIf(!process.env.DATABASE_URL)("seeded database", () => {
  it("has every category, product, image and event, linked correctly", async () => {
    const { makeClient } = await import("../src/lib/db");
    const db = makeClient();
    try {
      const want = seedRows();
      expect(await db.category.count()).toBe(want.categories.length);
      expect(await db.product.count()).toBe(want.products.length);
      expect(await db.communityEvent.count()).toBe(want.events.length);

      const products = await db.product.findMany({ include: { images: true, category: true } });
      for (const p of products) {
        expect(p.images, p.slug).toHaveLength(1);
        expect(p.images[0].url).toContain(`/${p.category.slug}/${p.slug}-1.jpg`);
        if (p.salePrice !== null) expect(p.salePrice).toBeLessThan(p.price);
      }
    } finally {
      await db.$disconnect();
    }
  }, 30_000);
});
