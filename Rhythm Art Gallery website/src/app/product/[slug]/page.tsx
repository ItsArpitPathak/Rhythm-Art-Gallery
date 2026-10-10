import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AddToBag } from "@/components/shop/add-to-bag";
import { ProductCard } from "@/components/shop/product-card";
import { ZoomImage } from "@/components/shop/zoom-image";
import { PageHeader } from "@/components/site/page-header";
import { getCategory, getProduct, PRODUCTS, productImage, productsIn } from "@/data/catalog";
import { formatPrice } from "@/lib/format";

type Params = Promise<{ slug: string }>;

export const generateStaticParams = () => PRODUCTS.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = getProduct((await params).slug);
  return { title: p ? `${p.name} | Rhythm Art Gallery` : "Not found", description: p?.description };
}

// Placeholder copy until the shop supplies real care and policy text.
const CARE: Record<string, string> = {
  saris: "Dry clean recommended. Store folded in muslin, away from direct sun. Refold every few months.",
  suits: "Gentle hand wash or dry clean. Wash embroidered pieces inside out in cold water.",
  jewellery: "Keep dry and away from perfume. Store each piece in its own pouch.",
  handbags: "Wipe with a soft dry cloth. Stuff with tissue when not in use.",
  purses: "Wipe with a soft dry cloth. Avoid overfilling to keep the shape.",
};

export default async function ProductPage({ params }: { params: Params }) {
  const product = getProduct((await params).slug);
  if (!product) notFound();
  const category = getCategory(product.category)!;
  const related = productsIn(product.category).filter((p) => p.slug !== product.slug).slice(0, 4);

  return (
    <main>
      <PageHeader
        title={product.name}
        crumbs={[{ label: "Shop", href: "/shop" }, { label: category.name, href: `/shop/${category.slug}` }, { label: product.name }]}
      />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-2">
        <ZoomImage src={productImage(product)} alt={product.name} />
        <div className="space-y-6">
          <div>
            <p className="text-2xl font-semibold">
              {formatPrice(product.salePrice ?? product.price)}
              {product.salePrice && <span className="ml-3 text-base font-normal text-ink/50 line-through">{formatPrice(product.price)}</span>}
            </p>
            <p className="mt-1 text-xs text-ink/60">Inclusive of all taxes</p>
          </div>
          <p className="text-ink/80">{product.description}</p>
          <AddToBag slug={product.slug} sizes={product.sizes} />
          <div className="divide-y divide-blush rounded-2xl bg-paper ring-1 ring-blush">
            {[
              ["Details", `Material: ${product.material}. Category: ${category.name}.`],
              ["Care", CARE[product.category]],
              ["Shipping & returns", "Ships in 3 to 5 working days. Returns accepted within 7 days of delivery, unworn and with tags."],
            ].map(([title, body]) => (
              <details key={title} className="group p-4">
                <summary className="flex cursor-pointer list-none items-center justify-between font-heading font-semibold">
                  {title}
                  <span className="text-rani transition-transform group-open:rotate-45" aria-hidden>+</span>
                </summary>
                <p className="mt-2 text-sm text-ink/75">{body}</p>
              </details>
            ))}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mx-auto mt-20 max-w-6xl px-4">
          <h2 className="mb-6 text-2xl font-semibold">You may also like</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
