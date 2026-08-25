import type { Metadata } from "next";
import ProductListing, { type ListingSearchParams } from "@/components/product/ProductListing";

export const metadata: Metadata = {
  title: "Jewellery",
  description: "Browse our full gold and silver jewellery collection.",
};

export default async function JewelleryPage({
  searchParams,
}: {
  searchParams: Promise<ListingSearchParams>;
}) {
  const params = await searchParams;
  return (
    <div className="section-ivory min-h-screen">
      <div className="mx-auto max-w-7xl px-4 md:px-8 pt-16">
        <h1 className="font-display text-4xl text-ink">All Jewellery</h1>
      </div>
      <ProductListing searchParams={params} />
    </div>
  );
}
