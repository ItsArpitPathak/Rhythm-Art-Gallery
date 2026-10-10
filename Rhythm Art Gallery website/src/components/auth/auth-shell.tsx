import Image from "next/image";

export function AuthShell({ title, intro, children }: { title: string; intro: string; children: React.ReactNode }) {
  return (
    <main className="mx-auto grid max-w-5xl overflow-hidden px-4 py-12 md:grid-cols-2 md:gap-0">
      <div className="relative hidden min-h-[28rem] overflow-hidden rounded-l-3xl md:block">
        <Image src="/images/story/embroidered-lehenga-1.jpg" alt="" fill sizes="480px" className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
        <p className="absolute bottom-8 left-8 right-8 font-heading text-2xl leading-snug text-paper">Every stitch has a story. Come in and find yours.</p>
      </div>
      <div className="rounded-3xl bg-paper/90 p-8 ring-1 ring-blush md:rounded-l-none md:p-10">
        <h1 className="text-3xl font-semibold">{title}</h1>
        <div className="embroidery-border mt-3 h-5 w-40" aria-hidden />
        <p className="mb-6 mt-3 text-sm text-ink/70">{intro}</p>
        {children}
      </div>
    </main>
  );
}
