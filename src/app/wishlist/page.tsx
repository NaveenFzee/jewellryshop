"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useWishlist } from "@/lib/wishlist";
import ProductCard from "@/components/product/ProductCard";
import GoldButton from "@/components/ui/GoldButton";
import type { Product } from "@/lib/types";

export default function WishlistPage() {
  const { ids } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ids.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    const supabase = createClient();
    setLoading(true);
    supabase
      .from("products")
      .select("*, product_images(*)")
      .in("id", ids)
      .then(({ data }) => {
        setProducts((data ?? []) as Product[]);
        setLoading(false);
      });
  }, [ids]);

  return (
    <div className="section-ivory min-h-screen py-20 px-4 md:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="font-display text-4xl text-ink mb-2">Your Wishlist</h1>
        <p className="text-ink/50 text-sm mb-10">Saved on this device — {ids.length} piece{ids.length === 1 ? "" : "s"}</p>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="ivory-card aspect-square animate-pulse bg-ink/5" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="mx-auto text-ink/20 mb-4" size={40} />
            <p className="text-ink/50 mb-6">Nothing saved yet — tap the heart icon on any piece to add it here.</p>
            <GoldButton href="/jewellery">Browse Jewellery</GoldButton>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
