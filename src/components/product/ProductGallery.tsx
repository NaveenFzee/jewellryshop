"use client";

import { useState } from "react";
import Image from "next/image";
import { clsx } from "clsx";
import type { ProductImage } from "@/lib/types";

const FALLBACK = "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=1200&auto=format&fit=crop";

export default function ProductGallery({ images, productName }: { images: ProductImage[]; productName: string }) {
  const sorted = [...images].sort((a, b) => a.display_order - b.display_order);
  const [active, setActive] = useState(0);
  const activeImage = sorted[active]?.image_url ?? FALLBACK;

  return (
    <div>
      <div className="relative aspect-square rounded-2xl overflow-hidden border border-champagne/20 mb-4">
        <Image src={activeImage} alt={productName} fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
      </div>
      {sorted.length > 1 && (
        <div className="flex gap-3 overflow-x-auto">
          {sorted.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
              className={clsx(
                "relative h-20 w-20 shrink-0 rounded-lg overflow-hidden border-2 transition-colors",
                i === active ? "border-champagne" : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <Image src={img.image_url} alt="" fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
