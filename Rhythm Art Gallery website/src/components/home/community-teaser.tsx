import Image from "next/image";
import Link from "next/link";
import { InView } from "@/components/motion-primitives/in-view";
import { SectionHeading } from "@/components/site/section-heading";
import { COMMUNITY_EVENTS } from "@/data/community";

export function CommunityTeaser() {
  const events = COMMUNITY_EVENTS.slice(0, 3);
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <SectionHeading eyebrow="Community" title="Rooted where we live" intro="Fairs we have joined, makers we stand with, and the circle we keep growing." />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {events.map((e, i) => (
          <InView
            key={e.slug}
            once
            variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6, delay: i * 0.12, ease: "easeOut" }}
          >
            <Link href="/community" className="group block overflow-hidden rounded-2xl bg-paper ring-1 ring-blush transition-shadow hover:shadow-xl hover:shadow-peacock/15">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src={e.image} alt={e.title} fill sizes="(min-width: 768px) 33vw, 90vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <span className="absolute left-3 top-3 rounded-full bg-peacock px-3 py-1 text-xs font-semibold text-paper">{e.kind}</span>
              </div>
              <div className="space-y-1 p-5">
                <p className="text-xs text-rani">{e.date} · {e.place}</p>
                <h3 className="font-heading text-lg font-semibold">{e.title}</h3>
                <p className="text-sm text-ink/70">{e.summary}</p>
              </div>
            </Link>
          </InView>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Link href="/community" className="inline-block rounded-full bg-peacock px-6 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-ink">
          Our community work
        </Link>
      </div>
    </section>
  );
}
