import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductBrowser } from "@/components/shop/product-browser";
import { PageHeader } from "@/components/site/page-header";
import { CATEGORIES, getCategory, productsIn } from "@/data/catalog";

type Params = Promise<{ category: string }>;

export const generateStaticParams = () => CATEGORIES.map((c) => ({ category: c.slug }));

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const c = getCategory((await params).category);
  return { title: c ? `${c.name} | Rhythm Art Gallery` : "Not found" };
}

export default async function CategoryPage({ params }: { params: Params }) {
  const category = getCategory((await params).category);
  if (!category) notFound();
  return (
    <main>
      <PageHeader
        title={category.name}
        intro={category.tagline}
        crumbs={[{ label: "Shop", href: "/shop" }, { label: category.name }]}
      />
      <div className="mx-auto max-w-6xl px-4">
        <ProductBrowser products={productsIn(category.slug)} showTabs={false} />
      </div>
    </main>
  );
}
