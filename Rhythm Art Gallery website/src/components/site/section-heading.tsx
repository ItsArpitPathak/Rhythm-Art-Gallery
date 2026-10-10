import { InView } from "@/components/motion-primitives/in-view";

export function SectionHeading({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <InView
      once
      variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rani">{eyebrow}</p>
        <h2 className="mt-2 text-3xl font-semibold md:text-4xl">{title}</h2>
        <div className="embroidery-border mx-auto mt-4 h-5 w-48" aria-hidden />
        {intro && <p className="mt-4 text-ink/70">{intro}</p>}
      </div>
    </InView>
  );
}
