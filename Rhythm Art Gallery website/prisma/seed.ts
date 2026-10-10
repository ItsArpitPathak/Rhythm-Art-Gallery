// Loads the placeholder catalogue and community events into the database. Safe to re-run (upserts by slug).
// Run: npm run db:seed
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { seedRows } from "./seed-data";

try {
  process.loadEnvFile();
} catch {
  /* DATABASE_URL may come from the environment */
}

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set.");
const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });

async function main() {
  const { categories, products, events } = seedRows();

  const categoryIds = new Map<string, string>();
  for (const c of categories) {
    const row = await db.category.upsert({ where: { slug: c.slug }, create: c, update: c });
    categoryIds.set(c.slug, row.id);
  }

  for (const { categorySlug, image, ...p } of products) {
    const categoryId = categoryIds.get(categorySlug);
    if (!categoryId) throw new Error(`Unknown category ${categorySlug} for ${p.slug}`);
    const row = await db.product.upsert({
      where: { slug: p.slug },
      create: { ...p, categoryId },
      update: { ...p, categoryId },
    });
    await db.productImage.deleteMany({ where: { productId: row.id } });
    await db.productImage.create({ data: { productId: row.id, url: image.url, alt: image.alt, sortOrder: 0 } });
  }

  for (const e of events) {
    await db.communityEvent.upsert({ where: { slug: e.slug }, create: e, update: e });
  }

  console.log(`Seeded ${categories.length} categories, ${products.length} products, ${events.length} events.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
