"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { whatsappLink } from "@/lib/config";
import { useWishlist } from "@/lib/wishlist";
import type { Product } from "@/lib/types";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=600&auto=format&fit=crop";

export default function ProductCard({ product }: { product: Product }) {
  const { toggle, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  const primaryImage =
    product.product_images?.find((img) => img.is_primary)?.image_url ??
    product.product_images?.[0]?.image_url ??
    FALLBACK_IMAGE;

  return (
    <div className="group ivory-card overflow-hidden flex flex-col">
      <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden">
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        <button
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wishlisted}
          onClick={(e) => {
            e.preventDefault();
            toggle(product.id);
          }}
          className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/90 flex items-center justify-center text-ink hover:text-oxblood transition-colors"
        >
          <Heart size={16} className={wishlisted ? "fill-oxblood text-oxblood" : ""} />
        </button>
        {product.is_new_arrival && (
          <span className="absolute top-3 left-3 bg-ink text-champagne text-[10px] font-label tracking-wider uppercase px-2.5 py-1 rounded-full">
            New
          </span>
        )}
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <p className="text-[11px] font-label tracking-wider uppercase text-ink/40 mb-1">
          {product.purity} {product.metal_type}
        </p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-display text-lg text-ink leading-snug mb-1 hover:text-champagne-dark transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-ink/40 mb-2">
          {product.sku} · {product.net_weight}g
        </p>
        <p className="text-sm text-ink/60 mb-4 flex-1">Price calculated based on today&apos;s gold rate</p>
        <div className="flex gap-2 mt-auto">
          <Link
            href={`/products/${product.slug}`}
            className="flex-1 text-center text-[11px] font-label tracking-wider uppercase border border-ink/20 rounded-full py-2.5 hover:border-champagne hover:text-champagne-dark transition-colors"
          >
            View Details
          </Link>
          <a
            href={whatsappLink(`Hi, I'm interested in ${product.name} (${product.sku}).`)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center text-[11px] font-label tracking-wider uppercase bg-ink text-champagne rounded-full py-2.5 hover:bg-ink/80 transition-colors"
          >
            Enquire
          </a>
        </div>
      </div>
    </div>
  );
}
