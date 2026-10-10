import { describe, expect, it } from "vitest";
import { PRODUCTS } from "@/data/catalog";
import { addLine, itemCount, lineKey, MAX_QTY, removeLine, setQty, totals } from "./cart";

const find = (slug: string) => PRODUCTS.find((p) => p.slug === slug);

describe("cart", () => {
  it("merges the same product and size, keeps different sizes apart", () => {
    let l = addLine([], { slug: "royal-blue-silk-suit", size: "M", qty: 1 });
    l = addLine(l, { slug: "royal-blue-silk-suit", size: "M", qty: 2 });
    l = addLine(l, { slug: "royal-blue-silk-suit", size: "L", qty: 1 });
    expect(l).toHaveLength(2);
    expect(itemCount(l)).toBe(4);
  });

  it("caps quantity and removes at zero", () => {
    let l = addLine([], { slug: "slate-satchel", qty: 8 });
    l = addLine(l, { slug: "slate-satchel", qty: 8 });
    expect(l[0].qty).toBe(MAX_QTY);
    expect(setQty(l, lineKey(l[0]), 0)).toEqual([]);
    expect(removeLine(l, lineKey(l[0]))).toEqual([]);
  });

  it("uses sale price and charges shipping only below the free threshold", () => {
    const small = totals([{ slug: "pink-studded-clutch", qty: 1 }], find); // 999 sale
    expect(small).toEqual({ subtotal: 999, shipping: 150, total: 1149 });
    const big = totals([{ slug: "violet-kanchipuram-saree", qty: 1 }], find); // 22,500
    expect(big.shipping).toBe(0);
    expect(totals([], find)).toEqual({ subtotal: 0, shipping: 0, total: 0 });
  });

  it("ignores unknown products", () => {
    expect(totals([{ slug: "nope", qty: 3 }], find).subtotal).toBe(0);
  });
});
