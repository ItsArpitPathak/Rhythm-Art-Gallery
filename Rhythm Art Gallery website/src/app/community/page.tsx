import type { Metadata } from "next";
import Image from "next/image";
import { InView } from "@/components/motion-primitives/in-view";
import { Tilt } from "@/components/motion-primitives/tilt";
import { PageHeader } from "@/components/site/page-header";
import { SHOP } from "@/components/site/nav-links";
import { COMMUNITY_EVENTS } from "@/data/community";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Community | Rhythm Art Gallery" };

// Placeholder copy until the shop writes its own.
const PILLARS = [
  { title: "Show up", text: "We take the boutique to fairs, melas and showcases so our neighbours can see the work up close." },
  { title: "Stand with makers", text: "The embroiderers and weavers behind each piece are credited, paid fairly and introduced in person." },
  { title: "Share the craft", text: "Free learning circles keep stitching traditions alive and open to anyone who wants to try." },
];

export default function CommunityPage() {
  return (
    <main>
      <PageHeader
        title="Our community"
        intro="Where we have been, who we have stood beside, and how we keep giving back to the place that raised us."
        crumbs={[{ label: "Community" }]}
      />

      <section className="mx-auto max-w-5xl px-4 py-8" aria-label="Timeline">
        <ol className="relative space-y-12 before:absolute before:left-4 before:top-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-rani before:via-marigold before:to-peacock md:before:left-1/2 md:before:-translate-x-px">
          {COMMUNITY_EVENTS.map((e, i) => (
            <li key={e.slug} className="relative pl-12 md:pl-0">
              <span className="absolute left-[9px] top-6 size-4 rounded-full border-4 border-paper bg-rani shadow md:left-1/2 md:-translate-x-1/2" aria-hidden />
              <InView
                once
                variants={{ hidden: { opacity: 0, x: i % 2 ? 40 : -40 }, visible: { opacity: 1, x: 0 } }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <div className={cn("md:w-[calc(50%-2.5rem)]", i % 2 ? "md:ml-auto" : "")}>
                  <Tilt rotationFactor={5} isRevese>
                    <article className="overflow-hidden rounded-2xl bg-paper ring-1 ring-blush">
                      <div className="relative aspect-[16/10]">
                        <Image src={e.image} alt={e.title} fill sizes="(min-width: 768px) 40vw, 90vw" className="object-cover" />
                        <span className="absolute left-3 top-3 rounded-full bg-peacock px-3 py-1 text-xs font-semibold text-paper">{e.kind}</span>
                      </div>
                      <div className="space-y-1 p-5">
                        <p className="text-xs text-rani">{e.date} · {e.place}</p>
                        <h2 className="font-heading text-xl font-semibold">{e.title}</h2>
                        <p className="text-sm text-ink/75">{e.summary}</p>
                      </div>
                    </article>
                  </Tilt>
                </div>
              </InView>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16 bg-cream/60 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-semibold">How we show up</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {PILLARS.map((p, i) => (
              <InView
                key={p.title}
                once
                variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: "easeOut" }}
              >
                <div className="h-full rounded-2xl bg-paper p-6 ring-1 ring-blush">
                  <p className="font-heading text-4xl text-marigold">0{i + 1}</p>
                  <h3 className="mt-2 font-heading text-xl font-semibold">{p.title}</h3>
                  <p className="mt-2 text-sm text-ink/75">{p.text}</p>
                </div>
              </InView>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h2 className="text-3xl font-semibold">Organising an event?</h2>
        <p className="mt-3 text-ink/70">We would love to join a fair, a showcase or a workshop near you.</p>
        <a href={`mailto:${SHOP.email}`} className="mt-6 inline-block rounded-full bg-rani px-7 py-3 text-sm font-semibold text-paper hover:bg-ink">
          Get in touch
        </a>
      </section>
    </main>
  );
}
