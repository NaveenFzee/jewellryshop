import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { calculateJewelleryPrice, ratePerGramFromRatePer10g, ratePer10gForPurity, formatINR } from "@/lib/pricing";
import ProductGallery from "@/components/product/ProductGallery";
import PriceBreakdown from "@/components/product/PriceBreakdown";
import ProductActionBar from "@/components/product/ProductActionBar";
import ProductCard from "@/components/product/ProductCard";
import { siteConfig } from "@/lib/config";
import type { Product } from "@/lib/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*, product_images(*), categories(id, name, slug)")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  return data as Product | null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product Not Found" };

  return {
    title: product.name,
    description:
      product.description ??
      `${product.name} — ${product.purity} ${product.metal_type}, ${product.net_weight}g. Available at ${siteConfig.name}.`,
    openGraph: {
      title: product.name,
      images: product.product_images?.[0]?.image_url ? [product.product_images[0].image_url] : undefined,
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const supabase = await createClient();

  let ratePerGram: number | null = null;
  if (product.metal_type === "gold") {
    const { data: goldRate } = await supabase
      .from("gold_rates")
      .select("*")
      .order("effective_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (goldRate) {
      const rate10g = ratePer10gForPurity(product.purity, goldRate);
      if (rate10g) ratePerGram = ratePerGramFromRatePer10g(rate10g);
    }
  } else {
    const { data: silverRate } = await supabase
      .from("silver_rates")
      .select("*")
      .order("effective_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (silverRate) ratePerGram = silverRate.rate / 1000; // silver quoted per kg
  }

  const breakdown = ratePerGram
    ? calculateJewelleryPrice({
        netWeight: product.net_weight,
        ratePerGram,
        makingChargeType: product.making_charge_type,
        makingChargeValue: product.making_charge_value,
        stoneCharge: product.stone_charge,
        gstPercentage: product.gst_percentage,
      })
    : null;

  const { data: related } = await supabase
    .from("products")
    .select("*, product_images(*)")
    .eq("is_active", true)
    .eq("category_id", product.category_id ?? "")
    .neq("id", product.id)
    .limit(4);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    description: product.description ?? undefined,
    image: product.product_images?.map((i) => i.image_url),
    offers: breakdown
      ? { "@type": "Offer", priceCurrency: "INR", price: breakdown.finalPrice.toFixed(2), availability: "https://schema.org/InStock" }
      : undefined,
  };

  return (
    <div className="section-ivory min-h-screen">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-4 md:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="text-xs text-ink/45 mb-8 font-label uppercase tracking-wider">
          <span>Jewellery</span>
          {product.categories && <span> / {product.categories.name}</span>}
          <span> / {product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-14">
          <ProductGallery images={product.product_images ?? []} productName={product.name} />

          <div>
            <p className="text-xs font-label uppercase tracking-wider text-champagne-dark mb-2">
              {product.purity} {product.metal_type} · {product.sku}
            </p>
            <h1 className="font-display text-3xl md:text-4xl text-ink mb-4">{product.name}</h1>
            {product.description && <p className="text-ink/65 mb-6">{product.description}</p>}

            <dl className="grid grid-cols-2 gap-4 mb-8 ivory-card p-5">
              <div>
                <dt className="text-[11px] font-label uppercase tracking-wider text-ink/40">Category</dt>
                <dd className="text-sm text-ink mt-0.5">{product.categories?.name ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-label uppercase tracking-wider text-ink/40">Purity</dt>
                <dd className="text-sm text-ink mt-0.5">{product.purity}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-label uppercase tracking-wider text-ink/40">Gross Weight</dt>
                <dd className="text-sm text-ink mt-0.5">{product.gross_weight} g</dd>
              </div>
              <div>
                <dt className="text-[11px] font-label uppercase tracking-wider text-ink/40">Net Weight</dt>
                <dd className="text-sm text-ink mt-0.5">{product.net_weight} g</dd>
              </div>
              {product.stone_weight > 0 && (
                <div>
                  <dt className="text-[11px] font-label uppercase tracking-wider text-ink/40">Stone Weight</dt>
                  <dd className="text-sm text-ink mt-0.5">{product.stone_weight} g</dd>
                </div>
              )}
              <div>
                <dt className="text-[11px] font-label uppercase tracking-wider text-ink/40">Current Rate</dt>
                <dd className="text-sm text-ink mt-0.5">{ratePerGram ? `${formatINR(ratePerGram)}/g` : "Unavailable"}</dd>
              </div>
            </dl>

            {breakdown && ratePerGram ? (
              <div className="mb-8">
                <PriceBreakdown
                  breakdown={breakdown}
                  ratePerGram={ratePerGram}
                  purity={product.purity}
                  netWeight={product.net_weight}
                  makingChargeType={product.making_charge_type}
                  makingChargeValue={product.making_charge_value}
                  gstPercentage={product.gst_percentage}
                />
              </div>
            ) : (
              <p className="ivory-card p-5 text-sm text-ink/60 mb-8">
                Price calculated based on today&apos;s gold rate — contact us for the current estimate.
              </p>
            )}

            <ProductActionBar productId={product.id} productName={product.name} sku={product.sku} />
          </div>
        </div>

        {related && related.length > 0 && (
          <div className="mt-24">
            <h2 className="font-display text-2xl text-ink mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {(related as Product[]).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
