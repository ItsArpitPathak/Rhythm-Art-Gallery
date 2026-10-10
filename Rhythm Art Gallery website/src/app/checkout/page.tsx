import type { Metadata } from "next";
import { CheckoutView } from "@/components/shop/checkout-view";
import { PageHeader } from "@/components/site/page-header";

export const metadata: Metadata = { title: "Checkout | Rhythm Art Gallery" };

export default function CheckoutPage() {
  return (
    <main>
      <PageHeader title="Checkout" crumbs={[{ label: "Bag", href: "/cart" }, { label: "Checkout" }]} />
      <div className="mx-auto max-w-6xl px-4">
        <CheckoutView />
      </div>
    </main>
  );
}
