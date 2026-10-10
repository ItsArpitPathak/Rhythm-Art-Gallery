import type { Metadata } from "next";
import { ProductBrowser } from "@/components/shop/product-browser";
import { PageHeader } from "@/components/site/page-header";
import { PRODUCTS } from "@/data/catalog";

export const metadata: Metadata = { title: "Shop | Rhythm Art Gallery" };

export default function ShopPage() {
  return (
    <main>
      <PageHeader title="Shop" intro="Saris, suits, jewellery and bags. Everything the boutique has on the rail." crumbs={[{ label: "Shop" }]} />
      <div className="mx-auto max-w-6xl px-4">
        <ProductBrowser products={PRODUCTS} />
      </div>
    </main>
  );
}
