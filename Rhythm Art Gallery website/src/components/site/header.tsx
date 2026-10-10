"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Disclosure, DisclosureContent, DisclosureTrigger } from "@/components/motion-primitives/disclosure";
import { ScrollProgress } from "@/components/motion-primitives/scroll-progress";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/use-cart";
import { NAV_LINKS, SHOP } from "./nav-links";

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { count: CART_COUNT } = useCart();
  const link = (href: string) =>
    cn(
      "rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-blush/60 hover:text-rani",
      pathname === href && "bg-blush text-rani",
    );

  return (
    <header className="sticky top-0 z-50 border-b border-blush/70 bg-paper/85 backdrop-blur">
      <ScrollProgress className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-rani via-marigold to-peacock" />
      <Disclosure open={open} onOpenChange={setOpen}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="flex items-center gap-3" aria-label={`${SHOP.name} home`}>
            <Image
              src="/brand/rag-logo.jpg"
              alt={`${SHOP.name} logo`}
              width={48}
              height={48}
              className="size-12 rounded-full object-cover ring-2 ring-marigold/70"
              priority
            />
            <span className="leading-tight">
              <span className="block font-heading text-lg font-semibold">{SHOP.name}</span>
              <span className="block text-xs tracking-[0.3em] text-rani">{SHOP.short}</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={link(l.href)}>
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <Link href="/cart" className="relative rounded-full p-2 hover:bg-blush/60 hover:text-rani" aria-label={`Cart, ${CART_COUNT} items`}>
              <Icon d="M6 7h13l-1.5 9h-10zM6 7 5 3H2M9 20.5h.01M16 20.5h.01" />
              {CART_COUNT > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-rani text-[10px] font-semibold text-paper">
                  {CART_COUNT}
                </span>
              )}
            </Link>
            <Link href="/login" className="hidden rounded-full bg-rani px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-ink sm:block">
              Login
            </Link>
            <DisclosureTrigger>
              <button type="button" className="rounded-full p-2 hover:bg-blush/60 md:hidden" aria-label="Menu">
                <Icon d={open ? "M6 6l12 12M18 6 6 18" : "M4 7h16M4 12h16M4 17h16"} />
              </button>
            </DisclosureTrigger>
          </div>
        </div>

        <DisclosureContent className="md:hidden">
          <nav className="flex flex-col gap-1 px-4 pb-4" aria-label="Mobile">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={link(l.href)} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <Link href="/login" className="mt-1 rounded-full bg-rani px-4 py-2 text-center text-sm font-medium text-paper" onClick={() => setOpen(false)}>
              Login
            </Link>
          </nav>
        </DisclosureContent>
      </Disclosure>
    </header>
  );
}
