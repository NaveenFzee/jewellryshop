import { createClient } from "@/lib/supabase/server";
import ProductFilters from "@/components/product/ProductFilters";
import ProductCard from "@/components/product/ProductCard";
import { calculateJewelleryPrice, ratePerGramFromRatePer10g, ratePer10gForPurity } from "@/lib/pricing";
import type { Product, Category, MetalType } from "@/lib/types";

export interface ListingSearchParams {
  category?: string;
  purity?: string;
  gender?: string;
  weightMin?: string;
  weightMax?: string;
  priceMin?: string;
  priceMax?: string;
  sort?: string;
}

function estimatePrice(
  product: Product,
  rates: { gold_24k: number; gold_22k: number; gold_20k: number; gold_18k: number; silver: number } | null
): number | null {
  if (!rates) return null;
  let ratePerGram: number | null = null;
  if (product.metal_type === "gold") {
    const r10g = ratePer10gForPurity(product.purity, rates);
    if (r10g) ratePerGram = ratePerGramFromRatePer10g(r10g);
  } else {
    ratePerGram = rates.silver / 1000;
  }
  if (!ratePerGram) return null;
  return calculateJewelleryPrice({
    netWeight: product.net_weight,
    ratePerGram,
    makingChargeType: product.making_charge_type,
    makingChargeValue: product.making_charge_value,
    stoneCharge: product.stone_charge,
    gstPercentage: product.gst_percentage,
  }).finalPrice;
}

export default async function ProductListing({
  metal,
  searchParams,
}: {
  metal?: MetalType;
  searchParams: ListingSearchParams;
}) {
  const supabase = await createClient();

  let query = supabase.from("products").select("*, product_images(*)").eq("is_active", true);
  if (metal) query = query.eq("metal_type", metal);
  if (searchParams.category) {
    const { data: cat } = await supabase.from("categories").select("id").eq("slug", searchParams.category).maybeSingle();
    if (cat) query = query.eq("category_id", cat.id);
  }
  if (searchParams.purity) query = query.eq("purity", searchParams.purity);
  if (searchParams.gender) query = query.eq("gender", searchParams.gender);
  if (searchParams.weightMin) query = query.gte("net_weight", Number(searchParams.weightMin));
  if (searchParams.weightMax) query = query.lte("net_weight", Number(searchParams.weightMax));
  if (searchParams.sort === "latest" || !searchParams.sort) query = query.order("created_at", { ascending: false });

  const { data: products } = await query;
  let list = (products ?? []) as Product[];

  const { data: allCategories } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });
  const categories = metal ? (allCategories ?? []).filter((c) => c.metal_type === metal) : allCategories ?? [];

  // Price-derived filtering/sorting requires the current rate.
  const needsPrice =
    searchParams.priceMin || searchParams.priceMax || searchParams.sort === "price_low" || searchParams.sort === "price_high";

  if (needsPrice) {
    const [{ data: gold }, { data: silver }] = await Promise.all([
      supabase.from("gold_rates").select("*").order("effective_at", { ascending: false }).limit(1).maybeSingle(),
      supabase.from("silver_rates").select("*").order("effective_at", { ascending: false }).limit(1).maybeSingle(),
    ]);
    const rates = gold && silver ? { ...gold, silver: silver.rate } : null;

    const withPrice = list.map((p) => ({ product: p, price: estimatePrice(p, rates) }));
    let filtered = withPrice;
    if (searchParams.priceMin) filtered = filtered.filter((x) => (x.price ?? 0) >= Number(searchParams.priceMin));
    if (searchParams.priceMax) filtered = filtered.filter((x) => (x.price ?? Infinity) <= Number(searchParams.priceMax));
    if (searchParams.sort === "price_low") filtered.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    if (searchParams.sort === "price_high") filtered.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    list = filtered.map((x) => x.product);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-16 grid lg:grid-cols-[240px_1fr] gap-10">
      <ProductFilters categories={categories as Category[]} />
      <div>
        <ProductFiltersBar count={list.length} />
        {list.length === 0 ? (
          <p className="text-ink/50 py-20 text-center">No jewellery matches these filters yet — try broadening your search.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {list.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Small server-rendered count line above the grid (kept separate from the
// client ProductFilters so the sort/filter controls stay client-only).
function ProductFiltersBar({ count }: { count: number }) {
  return <p className="text-xs text-ink/40 mb-6">{count} piece{count === 1 ? "" : "s"}</p>;
}
