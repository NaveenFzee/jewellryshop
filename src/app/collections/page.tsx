import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SectionHeading from "@/components/ui/SectionHeading";
import type { Collection } from "@/lib/types";

export const metadata: Metadata = { title: "Collections" };

export default async function CollectionsPage() {
  const supabase = await createClient();
  const { data: collections } = await supabase.from("collections").select("*").eq("is_active", true);
  const list = (collections ?? []) as Collection[];

  return (
    <div className="section-ivory min-h-screen py-20 px-4 md:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Curated" title="Our Collections" tone="ivory" />
        {list.length === 0 ? (
          <p className="text-center text-ink/50 py-16">Collections are being curated — check back soon.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((c) => (
              <Link key={c.id} href={`/collections/${c.slug}`} className="group relative aspect-[4/5] rounded-2xl overflow-hidden">
                <Image
                  src={c.banner_image_url || "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop"}
                  alt={c.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
                <div className="absolute bottom-0 p-6">
                  <h3 className="font-display text-2xl text-ivory">{c.name}</h3>
                  {c.description && <p className="text-sm text-ivory/70 mt-1">{c.description}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
