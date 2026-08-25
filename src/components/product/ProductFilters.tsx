"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { clsx } from "clsx";
import type { Category } from "@/lib/types";

const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "popular", label: "Popular" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
];

const PURITY_OPTIONS = ["24K", "22K", "18K", "92.5"];
const GENDER_OPTIONS = ["men", "women", "kids", "unisex"];

export default function ProductFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const update = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  };

  const activeCategory = searchParams.get("category");
  const activePurity = searchParams.get("purity");
  const activeGender = searchParams.get("gender");
  const activeSort = searchParams.get("sort") ?? "latest";

  const FilterBody = (
    <div className="space-y-8">
      <div>
        <p className="label-stamp mb-3">Category</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => update("category", null)}
            className={clsx(
              "text-xs px-3 py-1.5 rounded-full border transition-colors",
              !activeCategory ? "bg-ink text-champagne border-ink" : "border-ink/20 text-ink/60 hover:border-champagne-dark"
            )}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => update("category", c.slug)}
              className={clsx(
                "text-xs px-3 py-1.5 rounded-full border transition-colors",
                activeCategory === c.slug
                  ? "bg-ink text-champagne border-ink"
                  : "border-ink/20 text-ink/60 hover:border-champagne-dark"
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="label-stamp mb-3">Purity</p>
        <div className="flex flex-wrap gap-2">
          {PURITY_OPTIONS.map((p) => (
            <button
              key={p}
              onClick={() => update("purity", activePurity === p ? null : p)}
              className={clsx(
                "text-xs px-3 py-1.5 rounded-full border transition-colors",
                activePurity === p ? "bg-ink text-champagne border-ink" : "border-ink/20 text-ink/60 hover:border-champagne-dark"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="label-stamp mb-3">Gender</p>
        <div className="flex flex-wrap gap-2">
          {GENDER_OPTIONS.map((g) => (
            <button
              key={g}
              onClick={() => update("gender", activeGender === g ? null : g)}
              className={clsx(
                "text-xs px-3 py-1.5 rounded-full border capitalize transition-colors",
                activeGender === g ? "bg-ink text-champagne border-ink" : "border-ink/20 text-ink/60 hover:border-champagne-dark"
              )}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="label-stamp mb-3">Weight Range (g)</p>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            defaultValue={searchParams.get("weightMin") ?? ""}
            onBlur={(e) => update("weightMin", e.target.value || null)}
            className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm focus-visible:outline-champagne"
          />
          <input
            type="number"
            placeholder="Max"
            defaultValue={searchParams.get("weightMax") ?? ""}
            onBlur={(e) => update("weightMax", e.target.value || null)}
            className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm focus-visible:outline-champagne"
          />
        </div>
      </div>

      <div>
        <p className="label-stamp mb-3">Est. Price Range (₹)</p>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            defaultValue={searchParams.get("priceMin") ?? ""}
            onBlur={(e) => update("priceMin", e.target.value || null)}
            className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm focus-visible:outline-champagne"
          />
          <input
            type="number"
            placeholder="Max"
            defaultValue={searchParams.get("priceMax") ?? ""}
            onBlur={(e) => update("priceMax", e.target.value || null)}
            className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm focus-visible:outline-champagne"
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden inline-flex items-center gap-2 text-sm font-label uppercase tracking-wider text-ink border border-ink/20 rounded-full px-4 py-2"
        >
          <SlidersHorizontal size={14} /> Filters
        </button>
        <div className="hidden lg:block" />
        <select
          value={activeSort}
          onChange={(e) => update("sort", e.target.value)}
          className="text-sm border border-ink/20 rounded-full px-4 py-2 bg-transparent focus-visible:outline-champagne"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              Sort: {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block">{FilterBody}</aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div className="absolute inset-0 bg-ink/60" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-ivory p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <span className="label-stamp">Filters</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close filters">
                <X size={20} className="text-ink" />
              </button>
            </div>
            {FilterBody}
          </div>
        </div>
      )}
    </>
  );
}
