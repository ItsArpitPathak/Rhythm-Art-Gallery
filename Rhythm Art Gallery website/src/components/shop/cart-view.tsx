"use client";

import Image from "next/image";
import Link from "next/link";
import { getProduct, productImage } from "@/data/catalog";
import { FREE_SHIPPING_OVER, lineKey, MAX_QTY, totals } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/lib/use-cart";

export function CartView() {
  const cart = useCart();
  const lines = cart.lines.filter((l) => getProduct(l.slug));
  const sums = totals(lines, getProduct);

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-md rounded-3xl bg-paper/80 p-10 text-center ring-1 ring-blush">
        <p className="font-heading text-2xl">Your bag is empty</p>
        <p className="mt-2 text-ink/70">Silk, stones and stitches are waiting.</p>
        <Link href="/shop" className="mt-6 inline-block rounded-full bg-rani px-6 py-3 text-sm font-semibold text-paper hover:bg-ink">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <ul className="space-y-4">
        {lines.map((l) => {
          const p = getProduct(l.slug)!;
          const key = lineKey(l);
          const unit = p.salePrice ?? p.price;
          return (
            <li key={key} className="flex gap-4 rounded-2xl bg-paper p-4 ring-1 ring-blush">
              <Link href={`/product/${p.slug}`} className="relative aspect-[3/4] w-24 shrink-0 overflow-hidden rounded-xl bg-cream">
                <Image src={productImage(p)} alt={p.name} fill sizes="96px" className="object-cover" />
              </Link>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <Link href={`/product/${p.slug}`} className="font-heading text-lg font-semibold hover:text-rani">
                    {p.name}
                  </Link>
                  <p className="text-xs text-ink/60">{[p.material, l.size && `Size ${l.size}`].filter(Boolean).join(" · ")}</p>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center rounded-full ring-1 ring-ink/20">
                    <button type="button" aria-label="Decrease quantity" className="size-8 rounded-full hover:bg-blush/60" onClick={() => cart.setQty(key, l.qty - 1)}>
                      −
                    </button>
                    <span className="w-8 text-center text-sm tabular-nums" aria-live="polite">{l.qty}</span>
                    <button type="button" aria-label="Increase quantity" disabled={l.qty >= MAX_QTY} className="size-8 rounded-full hover:bg-blush/60 disabled:opacity-30" onClick={() => cart.setQty(key, l.qty + 1)}>
                      +
                    </button>
                  </div>
                  <p className="font-semibold">{formatPrice(unit * l.qty)}</p>
                </div>
              </div>
              <button type="button" aria-label={`Remove ${p.name}`} className="self-start rounded-full p-1.5 text-ink/50 hover:bg-blush/60 hover:text-rani" onClick={() => cart.remove(key)}>
                ✕
              </button>
            </li>
          );
        })}
      </ul>

      <aside className="h-fit space-y-4 rounded-2xl bg-paper p-6 ring-1 ring-blush lg:sticky lg:top-24">
        <h2 className="font-heading text-xl font-semibold">Order summary</h2>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrice(sums.subtotal)}</dd></div>
          <div className="flex justify-between"><dt>Shipping</dt><dd>{sums.shipping === 0 ? "Free" : formatPrice(sums.shipping)}</dd></div>
          <div className="flex justify-between border-t border-blush pt-3 text-base font-semibold"><dt>Total</dt><dd>{formatPrice(sums.total)}</dd></div>
        </dl>
        <p className="text-xs text-ink/60">Prices include GST. Free shipping over {formatPrice(FREE_SHIPPING_OVER)}.</p>
        <Link href="/checkout" className="block rounded-full bg-rani py-3 text-center text-sm font-semibold text-paper transition-colors hover:bg-ink">
          Proceed to checkout
        </Link>
        <button type="button" onClick={cart.clear} className="w-full text-center text-xs text-ink/60 hover:text-rani">
          Clear bag
        </button>
      </aside>
    </div>
  );
}
