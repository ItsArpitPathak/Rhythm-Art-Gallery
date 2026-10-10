import Image from "next/image";
import Link from "next/link";
import { GlowEffect } from "@/components/motion-primitives/glow-effect";
import { Magnetic } from "@/components/motion-primitives/magnetic";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import { TextLoop } from "@/components/motion-primitives/text-loop";
import { Tilt } from "@/components/motion-primitives/tilt";

const WORDS = ["Saris", "Suits", "Jewellery", "Handbags", "Purses"];

export function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-12 md:grid-cols-2 md:pt-20">
      <div className="space-y-6 text-center md:text-left">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rani">Boutique · Rhythm Art Gallery</p>
        <h1 className="text-4xl font-semibold leading-tight md:text-6xl">
          <TextEffect as="span" per="word" preset="fade-in-blur" speedReveal={1.4}>
            Wear the art of embroidery.
          </TextEffect>
        </h1>
        <div className="flex items-baseline justify-center gap-2 text-xl text-peacock md:justify-start">
          <span>Handpicked</span>
          <TextLoop className="font-heading font-semibold text-rani" interval={2.2}>
            {WORDS.map((w) => (
              <span key={w}>{w}</span>
            ))}
          </TextLoop>
        </div>
        <p className="mx-auto max-w-md text-ink/70 md:mx-0">
          Silks that remember the loom, jewellery that catches the lamp, bags that carry the day. Made for the way you celebrate.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
          <Magnetic intensity={0.3} range={80}>
            <div className="relative">
              <GlowEffect colors={["#c2185b", "#f5a524", "#0e7c86"]} mode="rotate" blur="medium" scale={1.05} />
              <Link
                href="/shop"
                className="relative block rounded-full bg-rani px-8 py-3 text-sm font-semibold text-paper transition-colors hover:bg-ink"
              >
                Explore the collection
              </Link>
            </div>
          </Magnetic>
          <Link href="/new-arrivals" className="rounded-full border border-ink/20 px-6 py-3 text-sm font-semibold hover:border-rani hover:text-rani">
            See new arrivals
          </Link>
        </div>
      </div>

      <Tilt rotationFactor={8} isRevese className="mx-auto w-full max-w-sm">
        <div className="relative">
          <div className="absolute -inset-3 translate-x-3 translate-y-3 rounded-t-[999px] rounded-b-3xl border-2 border-marigold" aria-hidden />
          <div className="relative aspect-[3/4] overflow-hidden rounded-t-[999px] rounded-b-3xl bg-cream shadow-2xl shadow-rani/20">
            <Image
              src="/images/products/saris/violet-kanchipuram-saree-1.jpg"
              alt="Woman wearing a violet and gold Kanchipuram saree"
              fill
              priority
              sizes="(min-width: 768px) 384px, 90vw"
              className="object-cover"
            />
          </div>
          <span className="absolute -left-4 bottom-10 rounded-full bg-paper px-4 py-2 text-xs font-semibold text-ink shadow-lg ring-1 ring-blush">
            Kanchipuram silk
          </span>
        </div>
      </Tilt>
    </section>
  );
}
