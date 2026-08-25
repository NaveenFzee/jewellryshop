"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "jewellery-wishlist";

function readWishlist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

/**
 * Client-only wishlist backed by localStorage, keyed by product id.
 * Fine for a guest-facing storefront; if you add customer accounts later,
 * sync this to a `wishlists` table keyed by customer id instead.
 */
export function useWishlist() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    setIds(readWishlist());
  }, []);

  const toggle = useCallback((productId: string) => {
    setIds((prev) => {
      const next = prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId];
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isWishlisted = useCallback((productId: string) => ids.includes(productId), [ids]);

  return { ids, toggle, isWishlisted };
}
