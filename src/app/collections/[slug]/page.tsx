import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/product/ProductCard";
import type { Collection, Product } from "@/lib/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("collections").select("name, description").eq("slug", slug).maybeSingle();
  return { title: data?.name ?? "Collection", description: data?.description ?? undefined };
}

export default async function CollectionDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: collection } = await supabase
    .from("collections")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (!collection) notFound();

  const { data: products } = await supabase
    .from("products")
    .select("*, product_images(*)")
    .eq("is_active", true)
    .eq("collection_id", (collection as Collection).id);

  const list = (products ?? []) as Product[];

  return (
    <div className="section-ivory min-h-screen py-20 px-4 md:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="font-display text-4xl text-ink mb-2">{(collection as Collection).name}</h1>
        {(collection as Collection).description && (
          <p className="text-ink/60 max-w-2xl mb-10">{(collection as Collection).description}</p>
        )}
        {list.length === 0 ? (
          <p className="text-ink/50 py-16 text-center">No pieces in this collection yet — check back soon.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {list.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
