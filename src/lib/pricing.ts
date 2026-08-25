// Implements exactly the formula from the spec:
//   Gold Value    = Net Gold Weight × Current Gold Rate (per gram)
//   Making Charge = configured percentage of Gold Value, OR a fixed amount
//   Stone Value   = configured amount
//   Subtotal      = Gold Value + Making Charge + Stone Value
//   GST           = configured GST% of Subtotal
//   Final Price   = Subtotal + GST
//
// Gold/silver rates are quoted per 10g in India (matches gold_rates table and
// the /api/gold-rates response) — callers must divide by 10 before passing
// in ratePerGram. See ratePerGramFromRatePer10g() below.

import type { MakingChargeType } from "./types";

export interface PricingInput {
  netWeight: number; // grams
  ratePerGram: number; // ₹ per gram, for this item's exact purity
  makingChargeType: MakingChargeType;
  makingChargeValue: number; // percentage points (e.g. 12) or a ₹ amount, depending on type
  stoneCharge: number; // ₹
  gstPercentage: number; // percentage points (e.g. 3)
}

export interface PricingBreakdown {
  goldValue: number;
  makingCharge: number;
  stoneValue: number;
  subtotal: number;
  gstAmount: number;
  finalPrice: number;
}

export function ratePerGramFromRatePer10g(ratePer10g: number): number {
  return ratePer10g / 10;
}

export function calculateJewelleryPrice(input: PricingInput): PricingBreakdown {
  const goldValue = round2(input.netWeight * input.ratePerGram);
  const makingCharge = round2(
    input.makingChargeType === "percentage"
      ? goldValue * (input.makingChargeValue / 100)
      : input.makingChargeValue
  );
  const stoneValue = round2(input.stoneCharge);
  const subtotal = round2(goldValue + makingCharge + stoneValue);
  const gstAmount = round2(subtotal * (input.gstPercentage / 100));
  const finalPrice = round2(subtotal + gstAmount);

  return { goldValue, makingCharge, stoneValue, subtotal, gstAmount, finalPrice };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Maps a product's purity string to the matching field on a gold rates row. */
export function ratePer10gForPurity(
  purity: string,
  rates: { rate_24k: number; rate_22k: number; rate_20k: number; rate_18k: number }
): number | null {
  const normalized = purity.trim().toUpperCase();
  if (normalized.includes("24")) return rates.rate_24k;
  if (normalized.includes("22")) return rates.rate_22k;
  if (normalized.includes("20")) return rates.rate_20k;
  if (normalized.includes("18")) return rates.rate_18k;
  return null; // e.g. silver purity like '92.5' — caller should use silver rate instead
}
