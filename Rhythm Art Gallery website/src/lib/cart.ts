import type { Product } from "@/data/catalog";

export type CartLine = { slug: string; size?: string; qty: number };

export const MAX_QTY = 10;
// Placeholder shipping rule until the shop confirms its own.
export const FREE_SHIPPING_OVER = 5000;
export const FLAT_SHIPPING = 150;

export const lineKey = (l: Pick<CartLine, "slug" | "size">) => `${l.slug}|${l.size ?? ""}`;
const clamp = (n: number) => Math.min(MAX_QTY, Math.max(1, Math.floor(n)));

export function addLine(lines: CartLine[], line: CartLine): CartLine[] {
  const key = lineKey(line);
  const found = lines.find((l) => lineKey(l) === key);
  if (!found) return [...lines, { ...line, qty: clamp(line.qty) }];
  return lines.map((l) => (lineKey(l) === key ? { ...l, qty: clamp(l.qty + line.qty) } : l));
}

export const setQty = (lines: CartLine[], key: string, qty: number) =>
  qty < 1 ? removeLine(lines, key) : lines.map((l) => (lineKey(l) === key ? { ...l, qty: clamp(qty) } : l));

export const removeLine = (lines: CartLine[], key: string) => lines.filter((l) => lineKey(l) !== key);

export const itemCount = (lines: CartLine[]) => lines.reduce((n, l) => n + l.qty, 0);

export function totals(lines: CartLine[], lookup: (slug: string) => Product | undefined) {
  // Prices are GST-inclusive. Unknown products are ignored (e.g. removed from the catalogue).
  const subtotal = lines.reduce((sum, l) => {
    const p = lookup(l.slug);
    return p ? sum + (p.salePrice ?? p.price) * l.qty : sum;
  }, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_OVER ? 0 : FLAT_SHIPPING;
  return { subtotal, shipping, total: subtotal + shipping };
}
