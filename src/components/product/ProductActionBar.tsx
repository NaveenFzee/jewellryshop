"use client";

import { useActionState, useState } from "react";
import { Heart, Share2, PhoneCall } from "lucide-react";
import GoldButton from "@/components/ui/GoldButton";
import { submitEnquiry, type ActionResult } from "@/lib/actions";
import { whatsappLink } from "@/lib/config";
import { useWishlist } from "@/lib/wishlist";

const initialState: ActionResult | null = null;

export default function ProductActionBar({
  productId,
  productName,
  sku,
}: {
  productId: string;
  productName: string;
  sku: string;
}) {
  const [state, formAction, isPending] = useActionState(submitEnquiry, initialState);
  const { toggle, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(productId);
  const [showCallback, setShowCallback] = useState(false);

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: productName, url: window.location.href });
      } catch {
        // user cancelled — no-op
      }
    } else if (typeof navigator !== "undefined") {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <GoldButton href={whatsappLink(`Hi, I'm interested in ${productName} (${sku}).`)} size="lg">
          Enquire on WhatsApp
        </GoldButton>
        <GoldButton variant="outline" size="lg" onClick={() => setShowCallback((v) => !v)}>
          <PhoneCall size={15} /> Request Callback
        </GoldButton>
        <button
          onClick={() => toggle(productId)}
          aria-pressed={wishlisted}
          aria-label="Add to wishlist"
          className="inline-flex items-center justify-center h-12 w-12 rounded-full border border-ink/15 hover:border-oxblood transition-colors"
        >
          <Heart size={18} className={wishlisted ? "fill-oxblood text-oxblood" : "text-ink/60"} />
        </button>
        <button
          onClick={handleShare}
          aria-label="Share product"
          className="inline-flex items-center justify-center h-12 w-12 rounded-full border border-ink/15 hover:border-champagne-dark transition-colors"
        >
          <Share2 size={18} className="text-ink/60" />
        </button>
      </div>

      {showCallback && (
        <form action={formAction} className="ivory-card p-5 space-y-3 max-w-md">
          <input type="hidden" name="productId" value={productId} />
          {state?.success ? (
            <p className="text-sm text-emerald-700">{state.message}</p>
          ) : (
            <>
              <p className="text-xs font-label uppercase tracking-wider text-ink/50">We&apos;ll call you back</p>
              <input
                name="name"
                placeholder="Your name"
                required
                className="w-full rounded-lg border border-ink/15 px-3 py-2.5 text-sm focus-visible:outline-champagne"
              />
              <input
                name="phone"
                type="tel"
                placeholder="Phone number"
                required
                className="w-full rounded-lg border border-ink/15 px-3 py-2.5 text-sm focus-visible:outline-champagne"
              />
              {state && !state.success && <p className="text-xs text-oxblood">{state.message}</p>}
              <GoldButton type="submit" size="sm" disabled={isPending}>
                {isPending ? "Sending…" : "Request Callback"}
              </GoldButton>
            </>
          )}
        </form>
      )}
    </div>
  );
}
