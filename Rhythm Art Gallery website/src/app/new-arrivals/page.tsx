import type { Metadata } from "next";
import { ProductBrowser } from "@/components/shop/product-browser";
import { PageHeader } from "@/components/site/page-header";
import { newArrivals } from "@/data/catalog";

export const metadata: Metadata = { title: "New arrivals | Rhythm Art Gallery" };

export default function NewArrivalsPage() {
  return (
    <main>
      <PageHeader
        title="New arrivals"
        intro="Fresh pieces across saris, suits, jewellery and bags. Pick a category to narrow it down."
        crumbs={[{ label: "New arrivals" }]}
      />
      <div className="mx-auto max-w-6xl px-4">
        <ProductBrowser products={newArrivals()} />
      </div>
    </main>
  );
}
