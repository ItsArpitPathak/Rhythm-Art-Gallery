import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rani">404</p>
      <h1 className="mt-2 text-4xl font-semibold">This thread has come loose</h1>
      <div className="embroidery-border mx-auto mt-4 h-5 w-48" aria-hidden />
      <p className="mt-4 text-ink/70">We could not find that page. Let us take you somewhere lovely instead.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/" className="rounded-full bg-rani px-6 py-3 text-sm font-semibold text-paper hover:bg-ink">Home</Link>
        <Link href="/shop" className="rounded-full border border-rani px-6 py-3 text-sm font-semibold text-rani hover:bg-rani hover:text-paper">Shop</Link>
      </div>
    </main>
  );
}
