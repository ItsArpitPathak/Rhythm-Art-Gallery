"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useState } from "react";
import { Field } from "@/components/auth/field";
import { getProduct, productImage } from "@/data/catalog";
import { totals } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { STATES } from "@/lib/india";
import { useCart } from "@/lib/use-cart";
import { type Errors, validateAddress } from "@/lib/validation";

const METHODS = [
  { id: "upi", label: "UPI", hint: "GPay, PhonePe, Paytm and more" },
  { id: "card", label: "Credit / debit card", hint: "Visa, Mastercard, RuPay" },
  { id: "netbanking", label: "Net banking", hint: "All major banks" },
];

/** Front-end only. Collects an address and shows the summary; payment needs the backend (Razorpay, objective stage 9). */
export function CheckoutView() {
  const { lines } = useCart();
  const stateId = useId();
  const [v, setV] = useState({ name: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "" });
  const [method, setMethod] = useState("upi");
  const [errors, setErrors] = useState<Errors<string>>({});
  const [done, setDone] = useState(false);
  const items = lines.filter((l) => getProduct(l.slug));
  const sums = totals(items, getProduct);
  const on = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setV((s) => ({ ...s, [k]: e.target.value }));

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md rounded-3xl bg-paper/80 p-10 text-center ring-1 ring-blush">
        <p className="font-heading text-2xl">Nothing to check out yet</p>
        <Link href="/shop" className="mt-6 inline-block rounded-full bg-rani px-6 py-3 text-sm font-semibold text-paper hover:bg-ink">Browse the shop</Link>
      </div>
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const found: Errors<string> = validateAddress(v);
    setErrors(found);
    setDone(Object.keys(found).length === 0);
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <div className="space-y-8">
        <section className="space-y-4 rounded-2xl bg-paper p-6 ring-1 ring-blush">
          <h2 className="font-heading text-xl font-semibold">1. Delivery address</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" autoComplete="name" value={v.name} onChange={on("name")} error={errors.name} />
            <Field label="Mobile number" type="tel" inputMode="numeric" autoComplete="tel" value={v.phone} onChange={on("phone")} error={errors.phone} />
          </div>
          <Field label="Address line 1" autoComplete="address-line1" value={v.line1} onChange={on("line1")} error={errors.line1} />
          <Field label="Address line 2 (optional)" autoComplete="address-line2" value={v.line2} onChange={on("line2")} />
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="City" autoComplete="address-level2" value={v.city} onChange={on("city")} error={errors.city} />
            <div>
              <label htmlFor={stateId} className="mb-1 block text-sm font-medium">State</label>
              <select
                id={stateId}
                value={v.state}
                onChange={on("state")}
                aria-invalid={Boolean(errors.state)}
                className="w-full rounded-xl border border-ink/20 bg-paper px-4 py-2.5 text-sm focus:border-rani focus:outline-none focus:ring-2 focus:ring-rani/20"
              >
                <option value="">Choose…</option>
                {STATES.map((s) => <option key={s}>{s}</option>)}
              </select>
              {errors.state && <p role="alert" className="mt-1 text-xs text-rani">{errors.state}</p>}
            </div>
            <Field label="Pincode" inputMode="numeric" autoComplete="postal-code" value={v.pincode} onChange={on("pincode")} error={errors.pincode} />
          </div>
        </section>

        <fieldset className="space-y-3 rounded-2xl bg-paper p-6 ring-1 ring-blush">
          <legend className="font-heading text-xl font-semibold">2. Payment</legend>
          {METHODS.map((m) => (
            <label key={m.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-ink/15 p-3 has-[:checked]:border-rani has-[:checked]:bg-blush/30">
              <input type="radio" name="method" checked={method === m.id} onChange={() => setMethod(m.id)} className="accent-rani" />
              <span><span className="block text-sm font-semibold">{m.label}</span><span className="block text-xs text-ink/60">{m.hint}</span></span>
            </label>
          ))}
          <p className="text-xs text-ink/60">Payments will go through Razorpay. Card and UPI details are entered on the Razorpay secure screen, never on this site.</p>
        </fieldset>
      </div>

      <aside className="h-fit space-y-4 rounded-2xl bg-paper p-6 ring-1 ring-blush lg:sticky lg:top-24">
        <h2 className="font-heading text-xl font-semibold">Order summary</h2>
        <ul className="space-y-3">
          {items.map((l) => {
            const p = getProduct(l.slug)!;
            return (
              <li key={`${l.slug}|${l.size ?? ""}`} className="flex gap-3 text-sm">
                <span className="relative aspect-[3/4] w-12 shrink-0 overflow-hidden rounded-lg bg-cream">
                  <Image src={productImage(p)} alt="" fill sizes="48px" className="object-cover" />
                </span>
                <span className="flex-1">
                  {p.name}
                  <span className="block text-xs text-ink/60">{l.size ? `Size ${l.size} · ` : ""}Qty {l.qty}</span>
                </span>
                <span>{formatPrice((p.salePrice ?? p.price) * l.qty)}</span>
              </li>
            );
          })}
        </ul>
        <dl className="space-y-2 border-t border-blush pt-4 text-sm">
          <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrice(sums.subtotal)}</dd></div>
          <div className="flex justify-between"><dt>Shipping</dt><dd>{sums.shipping === 0 ? "Free" : formatPrice(sums.shipping)}</dd></div>
          <div className="flex justify-between text-base font-semibold"><dt>Total</dt><dd>{formatPrice(sums.total)}</dd></div>
        </dl>
        <button type="submit" className="w-full rounded-full bg-rani py-3 text-sm font-semibold text-paper transition-colors hover:bg-ink">
          Place order
        </button>
        {done && (
          <p role="status" className="rounded-xl bg-marigold/20 p-3 text-sm">
            Address looks good. This is a preview: payment connects with the backend, so no order was placed and nothing was charged.
          </p>
        )}
        <Link href="/cart" className="block text-center text-xs text-ink/60 hover:text-rani">Back to bag</Link>
      </aside>
    </form>
  );
}
