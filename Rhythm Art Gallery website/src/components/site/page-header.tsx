import Link from "next/link";

export type Crumb = { label: string; href?: string };

export function PageHeader({ title, intro, crumbs }: { title: string; intro?: string; crumbs: Crumb[] }) {
  return (
    <header className="mx-auto max-w-6xl px-4 pb-8 pt-6">
      <nav aria-label="Breadcrumb" className="text-xs text-ink/60">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/" className="inline-flex min-h-11 items-center hover:text-rani">Home</Link></li>
          {crumbs.map((c) => (
            <li key={c.label} className="flex items-center gap-1.5">
              <span aria-hidden>/</span>
              {c.href ? <Link href={c.href} className="inline-flex min-h-11 items-center hover:text-rani">{c.label}</Link> : <span aria-current="page" className="text-ink">{c.label}</span>}
            </li>
          ))}
        </ol>
      </nav>
      <h1 className="mt-4 text-4xl font-semibold md:text-5xl">{title}</h1>
      <div className="embroidery-border mt-3 h-5 w-48" aria-hidden />
      {intro && <p className="mt-4 max-w-xl text-ink/70">{intro}</p>}
    </header>
  );
}
