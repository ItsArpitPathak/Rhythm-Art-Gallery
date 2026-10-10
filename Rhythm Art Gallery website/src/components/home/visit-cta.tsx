import Link from "next/link";
import { InView } from "@/components/motion-primitives/in-view";
import { SHOP } from "@/components/site/nav-links";

export function VisitCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-8">
      <InView once variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rani via-rani to-ink px-8 py-14 text-center text-paper">
          <div className="embroidery-border absolute inset-x-0 top-0 h-5 opacity-60" aria-hidden />
          <h2 className="text-3xl font-semibold md:text-4xl">Come see it in person</h2>
          <p className="mx-auto mt-3 max-w-lg text-cream/90">Touch the silk, try the jewellery, meet the people behind {SHOP.short}. {SHOP.address}.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/shop" className="rounded-full bg-marigold px-7 py-3 text-sm font-semibold text-ink transition-[transform,background-color,color,border-color] duration-150 ease-out active:scale-[0.97] hover:bg-cream">
              Shop online
            </Link>
            <a href={`tel:${SHOP.phone.replace(/\s/g, "")}`} className="rounded-full border border-cream/50 px-7 py-3 text-sm font-semibold transition-[transform,background-color,color,border-color] duration-150 ease-out active:scale-[0.97] hover:bg-paper/10">
              Call {SHOP.phone}
            </a>
          </div>
        </div>
      </InView>
    </section>
  );
}
