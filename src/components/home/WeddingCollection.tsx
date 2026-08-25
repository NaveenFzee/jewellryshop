import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import GoldButton from "@/components/ui/GoldButton";
import type { Product } from "@/lib/types";

export default async function WeddingCollection() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*, product_images(*)")
    .eq("is_active", true)
    .eq("is_bridal", true)
    .limit(4);

  const list = (products ?? []) as Product[];

  return (
    <section className="relative py-28 px-4 md:px-8 overflow-hidden" style={{ backgroundColor: "#6B1E2B" }}>
      <div
        className="absolute inset-0 opacity-40"
        style={{ background: "radial-gradient(circle at 20% 20%, rgba(201,163,91,0.25), transparent 55%)" }}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl grid lg:grid-cols-2 gap-14 items-center">
        <div>
          <div className="flex items-center gap-3 mb-5">
            <span className="h-px w-16 bg-champagne" />
            <span className="label-stamp text-champagne-light">The Bridal Edit</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-medium text-ivory mb-6 text-balance">
            Jewellery for Your Once-in-a-Lifetime Day
          </h2>
          <p className="text-ivory/75 max-w-md mb-8">
            Bridal sets, wedding chains, statement necklaces, bangles and earrings — designed to carry the
            weight and warmth of tradition, made to be handed down.
          </p>
          <GoldButton href="/collections/bridal" size="lg">
            Explore Bridal Collection
          </GoldButton>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {(list.length > 0
            ? list
            : Array.from({ length: 4 }).map((_, i) => ({ id: String(i), name: "", product_images: [] }))
          ).map((item, i) => (
            <div
              key={item.id}
              className={`relative aspect-[3/4] rounded-2xl overflow-hidden border border-champagne/25 ${
                i % 2 === 1 ? "mt-8" : ""
              }`}
            >
              <Image
                src={
                  (item as Product).product_images?.[0]?.image_url ||
                  `https://images.unsplash.com/photo-${
                    ["1611591437281-460bfbe1220a", "1515562141207-7a88fb7ce338", "1603561591411-07134e71a2a9", "1599643478518-a784e5dc4c8f"][i % 4]
                  }?q=80&w=600&auto=format&fit=crop`
                }
                alt={(item as Product).name || "Bridal jewellery"}
                fill
                className="object-cover"
                sizes="25vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
