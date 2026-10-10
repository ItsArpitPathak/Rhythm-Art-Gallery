import Image from "next/image";
import Link from "next/link";
import { AnimatedGroup } from "@/components/motion-primitives/animated-group";
import { Tilt } from "@/components/motion-primitives/tilt";
import { SectionHeading } from "@/components/site/section-heading";
import { CATEGORIES } from "@/data/catalog";

export function CategoryTiles() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <SectionHeading eyebrow="Shop by category" title="Find your piece" intro="Five corners of the boutique, one thread of craft." />
      <AnimatedGroup
        preset="blur-slide"
        className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-5"
      >
        {CATEGORIES.map((c) => (
          <Tilt key={c.slug} rotationFactor={10} isRevese>
            <Link href={`/shop/${c.slug}`} className="group relative block aspect-[3/4] overflow-hidden rounded-2xl ring-1 ring-blush">
              <Image
                src={c.cover}
                alt=""
                fill
                sizes="(min-width: 768px) 20vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-paper">
                <h3 className="font-heading text-xl font-semibold">{c.name}</h3>
                <p className="text-xs text-cream/80">{c.tagline}</p>
              </div>
            </Link>
          </Tilt>
        ))}
      </AnimatedGroup>
    </section>
  );
}
