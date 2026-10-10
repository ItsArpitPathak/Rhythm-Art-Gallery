import type { Metadata } from "next";
import { CartView } from "@/components/shop/cart-view";

export const metadata: Metadata = { title: "Your bag | Rhythm Art Gallery" };

export default function CartPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-semibold md:text-4xl">Your bag</h1>
      <CartView />
    </main>
  );
}
