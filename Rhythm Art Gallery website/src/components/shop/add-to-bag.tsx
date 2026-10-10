"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MAX_QTY } from "@/lib/cart";
import { useCart } from "@/lib/use-cart";
import { cn } from "@/lib/utils";

export function AddToBag({ slug, sizes }: { slug: string; sizes?: string[] }) {
  const router = useRouter();
  const cart = useCart();
  const [size, setSize] = useState<string | undefined>(sizes?.length === 1 ? sizes[0] : undefined);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [needSize, setNeedSize] = useState(false);

  function commit() {
    if (sizes && !size) {
      setNeedSize(true);
      return false;
    }
    cart.add({ slug, size, qty });
    return true;
  }

  return (
    <div className="space-y-5">
      {sizes && (
        <fieldset>
          <legend className="mb-2 text-sm font-semibold">Size</legend>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => (
              <label
                key={s}
                className={cn(
                  "cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors",
                  size === s ? "border-rani bg-rani text-paper" : "border-ink/20 hover:border-rani",
                )}
              >
                <input type="radio" name="size" value={s} className="sr-only" checked={size === s} onChange={() => { setSize(s); setNeedSize(false); }} />
                {s}
              </label>
            ))}
          </div>
          {needSize && <p role="alert" className="mt-2 text-sm text-rani">Please choose a size.</p>}
        </fieldset>
      )}

      <div className="flex items-center gap-4">
        <div className="flex items-center rounded-full ring-1 ring-ink/20">
          <button type="button" aria-label="Decrease quantity" className="size-10 rounded-full hover:bg-blush/60" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
          <span className="w-8 text-center tabular-nums" aria-live="polite">{qty}</span>
          <button type="button" aria-label="Increase quantity" className="size-10 rounded-full hover:bg-blush/60" onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))}>+</button>
        </div>
        <button
          type="button"
          className="flex-1 rounded-full bg-rani px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-ink"
          onClick={() => { if (commit()) { setAdded(true); setTimeout(() => setAdded(false), 2500); } }}
        >
          {added ? "Added to bag ✓" : "Add to bag"}
        </button>
      </div>
      <button
        type="button"
        className="w-full rounded-full border border-rani px-6 py-3 text-sm font-semibold text-rani transition-colors hover:bg-rani hover:text-paper"
        onClick={() => { if (commit()) router.push("/checkout"); }}
      >
        Buy now
      </button>
      {added && (
        <p className="text-sm">
          <Link href="/cart" className="font-semibold text-peacock underline">View your bag</Link>
        </p>
      )}
    </div>
  );
}
