import Image from "next/image";
import Link from "next/link";
import { AnimatedGroup } from "@/components/motion-primitives/animated-group";
import { SectionHeading } from "@/components/site/section-heading";
import { CATEGORIES } from "@/data/catalog";
import { cn } from "@/lib/utils";

export function CategoryTiles() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <SectionHeading eyebrow="Shop by category" title="Find your piece" intro="Five corners of the boutique, one thread of craft." />
      <AnimatedGroup preset="blur-slide" className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 [&>div:first-child]:col-span-2 md:[&>div:first-child]:row-span-2">
        {CATEGORIES.map((c, i) => {
          const feature = i === 0; // lead category gets the big tile
          return (
            <Link
              key={c.slug}
              href={`/shop/${c.slug}`}
              className={cn(
                "group relative block overflow-hidden rounded-2xl ring-1 ring-blush",
                feature ? "aspect-[4/3] md:aspect-auto md:h-full" : "aspect-[3/4]",
              )}
            >
              <Image
                src={c.cover}
                alt=""
                fill
                sizes={feature ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"}
                className="object-cover transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-paper">
                <h3 className={cn("font-heading font-semibold", feature ? "text-3xl" : "text-xl")}>{c.name}</h3>
                <p className="text-xs text-cream/80">{c.tagline}</p>
              </div>
            </Link>
          );
        })}
      </AnimatedGroup>
    </section>
  );
}
