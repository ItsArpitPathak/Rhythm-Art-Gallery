import Link from "next/link";
import { ProductCard } from "@/components/shop/product-card";
import { SectionHeading } from "@/components/site/section-heading";
import { newArrivals } from "@/data/catalog";

// Native scroll-snap row. Motion Primitives' Carousel needs lucide-react (new dependency), so it is not used.
export function NewArrivalsStrip() {
  const items = newArrivals();
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading eyebrow="Just in" title="New arrivals" intro="Fresh from the loom and the workshop this season." />
      </div>
      <div className="mx-auto mt-12 max-w-6xl">
        <ul className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-6 [scrollbar-color:var(--color-rani)_transparent]">
          {items.map((p) => (
            <li key={p.slug} className="w-56 shrink-0 snap-start sm:w-64">
              <ProductCard product={p} sizes="256px" />
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 text-center">
        <Link href="/new-arrivals" className="inline-block rounded-full border border-rani px-6 py-3 text-sm font-semibold text-rani transition-[transform,background-color,color] duration-150 ease-out active:scale-[0.97] hover:bg-rani hover:text-paper">
          View all new arrivals
        </Link>
      </div>
    </section>
  );
}
