import Image from "next/image";
import Link from "next/link";
import { NAV_LINKS, SHOP } from "./nav-links";

export function Footer() {
  return (
    <footer className="mt-24 bg-ink text-cream">
      <div className="embroidery-border h-6 bg-paper" aria-hidden />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-3">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Image src="/brand/rag-logo.jpg" alt="" width={56} height={56} className="size-14 rounded-full object-cover ring-2 ring-marigold" />
            <div>
              <p className="font-heading text-xl text-paper">{SHOP.name}</p>
              <p className="text-xs tracking-[0.3em] text-marigold">{SHOP.short}</p>
            </div>
          </div>
          <p className="max-w-xs text-sm text-cream/80">Sarees, suits, jewellery and handbags, made with embroidery and care.</p>
        </div>

        <nav aria-label="Footer" className="space-y-3">
          <h2 className="font-heading text-lg text-paper">Explore</h2>
          <ul className="space-y-2 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-marigold">{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-3">
          <h2 className="font-heading text-lg text-paper">Visit & contact</h2>
          <ul className="space-y-2 text-sm text-cream/80">
            <li>{SHOP.address}</li>
            <li><a href={`tel:${SHOP.phone.replace(/\s/g, "")}`} className="hover:text-marigold">{SHOP.phone}</a></li>
            <li><a href={`mailto:${SHOP.email}`} className="hover:text-marigold">{SHOP.email}</a></li>
            <li><a href={SHOP.instagram} className="hover:text-marigold" rel="noopener noreferrer" target="_blank">Instagram</a></li>
          </ul>
        </div>
      </div>
      <p className="border-t border-cream/15 py-4 text-center text-xs text-cream/60">© {SHOP.name} ({SHOP.short}). All rights reserved.</p>
    </footer>
  );
}
