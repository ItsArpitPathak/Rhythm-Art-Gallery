"use client";

import { useState } from "react";
import { AnimatedBackground } from "@/components/motion-primitives/animated-background";
import { AnimatedGroup } from "@/components/motion-primitives/animated-group";
import { CATEGORIES, type Product } from "@/data/catalog";
import { ProductCard } from "./product-card";

type Sort = "featured" | "low" | "high";
type Range = "any" | "u3" | "m" | "o10";

const RANGES: Record<Range, { label: string; test: (n: number) => boolean }> = {
  any: { label: "Any price", test: () => true },
  u3: { label: "Under ₹3,000", test: (n) => n < 3000 },
  m: { label: "₹3,000 – ₹10,000", test: (n) => n >= 3000 && n <= 10000 },
  o10: { label: "Over ₹10,000", test: (n) => n > 10000 },
};

const price = (p: Product) => p.salePrice ?? p.price;

/** Category tabs + sort + price filter over a given product list. Client-side only (no backend yet). */
export function ProductBrowser({ products, showTabs = true }: { products: Product[]; showTabs?: boolean }) {
  const [cat, setCat] = useState("all");
  const [sort, setSort] = useState<Sort>("featured");
  const [range, setRange] = useState<Range>("any");

  const tabs = [{ slug: "all", name: "All" }, ...CATEGORIES.filter((c) => products.some((p) => p.category === c.slug))];
  const shown = products
    .filter((p) => cat === "all" || p.category === cat)
    .filter((p) => RANGES[range].test(price(p)))
    .sort((a, b) => (sort === "low" ? price(a) - price(b) : sort === "high" ? price(b) - price(a) : 0));

  const select = "rounded-full border border-ink/20 bg-paper min-h-11 px-4 py-2 text-base focus:border-rani focus:outline-none md:min-h-0 md:text-sm";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        {showTabs ? (
          <div className="flex flex-wrap gap-1 rounded-full bg-cream/80 p-1 ring-1 ring-blush" role="tablist" aria-label="Category">
            <AnimatedBackground
              defaultValue={cat}
              onValueChange={(id) => id && setCat(id)}
              className="rounded-full bg-rani"
              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            >
              {tabs.map((t) => (
                <button
                  key={t.slug}
                  data-id={t.slug}
                  type="button"
                  role="tab"
                  aria-selected={cat === t.slug}
                  className="min-h-11 rounded-full px-4 py-2 text-sm font-medium transition-colors data-[checked=true]:text-paper md:min-h-0"
                >
                  {t.name}
                </button>
              ))}
            </AnimatedBackground>
          </div>
        ) : (
          <span />
        )}
        <div className="flex flex-wrap gap-2">
          <label className="sr-only" htmlFor="price-range">Price range</label>
          <select id="price-range" className={select} value={range} onChange={(e) => setRange(e.target.value as Range)}>
            {Object.entries(RANGES).map(([k, r]) => (
              <option key={k} value={k}>{r.label}</option>
            ))}
          </select>
          <label className="sr-only" htmlFor="sort">Sort</label>
          <select id="sort" className={select} value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
            <option value="featured">Featured</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
          </select>
        </div>
      </div>

      <p className="mt-6 text-sm text-ink/60" aria-live="polite">{shown.length} {shown.length === 1 ? "piece" : "pieces"}</p>

      {shown.length === 0 ? (
        <div className="mt-8 rounded-3xl bg-paper/80 p-12 text-center ring-1 ring-blush">
          <p className="font-heading text-xl">Nothing matches those filters</p>
          <button type="button" className="mt-4 text-sm font-semibold text-rani underline" onClick={() => { setCat("all"); setRange("any"); }}>
            Clear filters
          </button>
        </div>
      ) : (
        <AnimatedGroup
          key={`${cat}-${sort}-${range}`}
          preset="blur-slide"
          className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4"
        >
          {shown.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </AnimatedGroup>
      )}
    </div>
  );
}
