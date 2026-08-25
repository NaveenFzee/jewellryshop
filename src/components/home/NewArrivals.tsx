import { createClient } from "@/lib/supabase/server";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/lib/types";

export default async function NewArrivals() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*, product_images(*)")
    .eq("is_active", true)
    .eq("is_new_arrival", true)
    .order("created_at", { ascending: false })
    .limit(10);

  const list = (products ?? []) as Product[];
  if (list.length === 0) return null;

  return (
    <section className="section-ink py-24 px-4 md:px-8 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Just In" title="New Arrivals" align="left" />
      </div>
      <div className="flex gap-6 overflow-x-auto pb-4 px-4 md:px-8 snap-x snap-mandatory scrollbar-none">
        {list.map((p) => (
          <div key={p.id} className="min-w-[260px] max-w-[260px] snap-start">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
