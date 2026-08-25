import { createClient } from "@/lib/supabase/server";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductCard from "@/components/product/ProductCard";
import GoldButton from "@/components/ui/GoldButton";
import type { Product } from "@/lib/types";

export default async function FeaturedProducts() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*, product_images(*)")
    .eq("is_active", true)
    .eq("is_featured", true)
    .limit(8);

  const list = (products ?? []) as Product[];
  if (list.length === 0) return null;

  return (
    <section className="section-ivory py-24 px-4 md:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Featured" title="This Season's Collection" tone="ivory" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <div className="flex justify-center mt-12">
          <GoldButton href="/jewellery" variant="outline">
            View All Jewellery
          </GoldButton>
        </div>
      </div>
    </section>
  );
}
