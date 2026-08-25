import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductListing, { type ListingSearchParams } from "@/components/product/ProductListing";
import type { MetalType } from "@/lib/types";

interface PageProps {
  params: Promise<{ metal: string }>;
  searchParams: Promise<ListingSearchParams>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { metal } = await params;
  return { title: metal === "gold" ? "Gold Jewellery" : metal === "silver" ? "Silver Jewellery" : "Jewellery" };
}

export default async function MetalJewelleryPage({ params, searchParams }: PageProps) {
  const { metal } = await params;
  if (metal !== "gold" && metal !== "silver") notFound();
  const sp = await searchParams;

  return (
    <div className="section-ivory min-h-screen">
      <div className="mx-auto max-w-7xl px-4 md:px-8 pt-16">
        <h1 className="font-display text-4xl text-ink capitalize">{metal} Jewellery</h1>
      </div>
      <ProductListing metal={metal as MetalType} searchParams={sp} />
    </div>
  );
}
