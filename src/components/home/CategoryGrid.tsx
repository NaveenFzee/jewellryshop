import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SectionHeading from "@/components/ui/SectionHeading";
import type { Category } from "@/lib/types";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600&auto=format&fit=crop";

export default async function CategoryGrid() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  const list = (categories ?? []) as Category[];
  if (list.length === 0) return null;

  const gold = list.filter((c) => c.metal_type === "gold");
  const silver = list.filter((c) => c.metal_type === "silver");

  const Row = ({ title, items }: { title: string; items: Category[] }) =>
    items.length === 0 ? null : (
      <div className="mb-14 last:mb-0">
        <h3 className="label-stamp mb-6">{title}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {items.map((cat) => (
            <Link
              key={cat.id}
              href={`/jewellery/${cat.metal_type}?category=${cat.slug}`}
              className="group relative aspect-[4/5] rounded-2xl overflow-hidden border border-champagne/15"
            >
              <Image
                src={cat.image_url || FALLBACK_IMAGE}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="font-display text-lg text-ivory">{cat.name}</p>
                <span className="text-[11px] font-label tracking-wider uppercase text-champagne opacity-0 group-hover:opacity-100 transition-opacity">
                  View Collection →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );

  return (
    <section className="section-ink py-24 px-4 md:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Browse" title="Shop by Category" />
        <Row title="Gold Jewellery" items={gold} />
        <Row title="Silver Jewellery" items={silver} />
      </div>
    </section>
  );
}
