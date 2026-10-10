import Image from "next/image";
import Link from "next/link";
import { type Product, productImage } from "@/data/catalog";
import { formatPrice } from "@/lib/format";

export function ProductCard({ product, sizes = "(min-width: 1024px) 25vw, 50vw" }: { product: Product; sizes?: string }) {
  const { name, slug, price, salePrice, isNew, material } = product;
  return (
    <Link href={`/product/${slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-cream ring-1 ring-blush/60 transition-shadow group-hover:shadow-xl group-hover:shadow-rani/15">
        <Image
          src={productImage(product)}
          alt={name}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-105"
        />
        {isNew && (
          <span className="absolute left-3 top-3 rounded-full bg-marigold px-3 py-1 text-xs font-semibold text-ink">New</span>
        )}
        {salePrice && (
          <span className="absolute right-3 top-3 rounded-full bg-rani px-3 py-1 text-xs font-semibold text-paper">Sale</span>
        )}
      </div>
      <div className="mt-3 space-y-0.5">
        <h3 className="font-heading text-base font-semibold leading-snug group-hover:text-rani">{name}</h3>
        <p className="text-xs text-ink/60">{material}</p>
        <p className="text-sm font-semibold">
          {formatPrice(salePrice ?? price)}
          {salePrice && <span className="ml-2 font-normal text-ink/50 line-through">{formatPrice(price)}</span>}
        </p>
      </div>
    </Link>
  );
}
