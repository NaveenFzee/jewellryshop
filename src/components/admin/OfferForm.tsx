"use client";

import { useActionState } from "react";
import GoldButton from "@/components/ui/GoldButton";
import type { ActionResult } from "@/lib/actions";

const initialState: ActionResult | null = null;
const inputClass = "mt-1.5 w-full rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 text-sm focus-visible:outline-champagne";
const labelClass = "text-xs font-label uppercase tracking-wider text-ink/55";

export default function OfferForm({
  action,
}: {
  action: (prev: ActionResult | null, formData: FormData) => Promise<ActionResult>;
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className={labelClass}>Title *</label>
        <input name="title" required className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Description</label>
        <textarea name="description" rows={2} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Discount Text</label>
        <input name="discount_text" placeholder="e.g. Making charges from 5%" className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Banner Image URL</label>
        <input name="banner_image_url" type="url" className={inputClass} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Valid From *</label>
          <input name="valid_from" type="date" required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Valid Until *</label>
          <input name="valid_until" type="date" required className={inputClass} />
        </div>
      </div>
      <div>
        <label className={labelClass}>Terms & Conditions</label>
        <textarea name="terms_conditions" rows={2} className={inputClass} />
      </div>
      <label className="flex items-center gap-2 text-sm text-ink/75">
        <input type="checkbox" name="is_active" defaultChecked className="h-4 w-4 accent-champagne" />
        Active
      </label>

      {state && (
        <p className={`text-sm ${state.success ? "text-emerald-700" : "text-oxblood"}`}>{state.message}</p>
      )}

      <GoldButton type="submit" size="sm" disabled={isPending} className="w-full">
        {isPending ? "Saving…" : "Create Offer"}
      </GoldButton>
    </form>
  );
}
