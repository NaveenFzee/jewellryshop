"use client";

import { useActionState } from "react";
import GoldButton from "@/components/ui/GoldButton";
import { updateGoldRate, updateSilverRate } from "@/lib/admin-actions-offers-rates";
import type { ActionResult } from "@/lib/actions";
import type { GoldRateRow, SilverRateRow } from "@/lib/types";

const initialState: ActionResult | null = null;
const inputClass = "mt-1.5 w-full rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 text-sm focus-visible:outline-champagne";
const labelClass = "text-xs font-label uppercase tracking-wider text-ink/55";

export default function RateForm({
  type,
  defaults,
}: {
  type: "gold" | "silver";
  defaults?: GoldRateRow | SilverRateRow;
}) {
  const action = type === "gold" ? updateGoldRate : updateSilverRate;
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {type === "gold" ? (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>24K Rate (₹/10g)</label>
            <input name="rate_24k" type="number" step="0.01" defaultValue={(defaults as GoldRateRow)?.rate_24k} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>22K Rate (₹/10g)</label>
            <input name="rate_22k" type="number" step="0.01" defaultValue={(defaults as GoldRateRow)?.rate_22k} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>20K Rate (₹/10g)</label>
            <input name="rate_20k" type="number" step="0.01" defaultValue={(defaults as GoldRateRow)?.rate_20k} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>18K Rate (₹/10g)</label>
            <input name="rate_18k" type="number" step="0.01" defaultValue={(defaults as GoldRateRow)?.rate_18k} required className={inputClass} />
          </div>
        </div>
      ) : (
        <div>
          <label className={labelClass}>Silver Rate (₹/kg)</label>
          <input name="rate" type="number" step="0.01" defaultValue={(defaults as SilverRateRow)?.rate} required className={inputClass} />
        </div>
      )}

      {state && <p className={`text-sm ${state.success ? "text-emerald-700" : "text-oxblood"}`}>{state.message}</p>}

      <GoldButton type="submit" size="sm" disabled={isPending} className="w-full">
        {isPending ? "Updating…" : `Update ${type === "gold" ? "Gold" : "Silver"} Rate`}
      </GoldButton>
    </form>
  );
}
