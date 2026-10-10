import Image from "next/image";
import { InView } from "@/components/motion-primitives/in-view";
import { SectionHeading } from "@/components/site/section-heading";
import { CountUp } from "./count-up";

// Placeholder figures until the shop supplies real ones.
const STATS = [
  { value: 10, suffix: "+", label: "Years of craft" },
  { value: 500, suffix: "+", label: "Pieces curated" },
  { value: 12, suffix: "", label: "Community events" },
];

export function CraftStory() {
  return (
    <section className="bg-cream/60 py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 md:grid-cols-2">
        <InView once variants={{ hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0 } }} transition={{ duration: 0.7, ease: "easeOut" }}>
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <div className="absolute inset-0 rotate-3 rounded-[2rem] bg-blush" aria-hidden />
            <div className="relative h-full overflow-hidden rounded-[2rem] ring-4 ring-paper">
              <Image src="/images/story/embroidery-hoop-1.jpg" alt="Hands holding a floral embroidery hoop" fill sizes="(min-width: 768px) 448px, 90vw" className="object-cover" />
            </div>
          </div>
        </InView>

        <div className="space-y-6">
          <SectionHeading eyebrow="Our craft" title="Stitched slowly, worn proudly" />
          <p className="text-ink/75">
            Every border, bloom and motif starts with hands and patience. We bring together weavers and embroiderers whose work has travelled through families, and
            put it where you can wear it.
          </p>
          <dl className="grid grid-cols-3 gap-4 text-center">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-2xl bg-paper p-4 ring-1 ring-blush">
                <dd className="font-heading text-3xl font-semibold text-rani">
                  <CountUp value={s.value} />
                  {s.suffix}
                </dd>
                <dt className="mt-1 text-xs text-ink/70">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
