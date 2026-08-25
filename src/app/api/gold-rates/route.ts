import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { GoldRatesResponse } from "@/lib/types";

// Revalidate at most once a minute — the live-ness comes from admin-entered
// rates (or a wired-up provider, see README), not from hitting the DB on
// every request.
export const revalidate = 60;

export async function GET() {
  const supabase = await createClient();

  const [{ data: gold, error: goldError }, { data: silver, error: silverError }] = await Promise.all([
    supabase.from("gold_rates").select("*").order("effective_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("silver_rates").select("*").order("effective_at", { ascending: false }).limit(1).maybeSingle(),
  ]);

  // Per spec: if rates can't be loaded, never fabricate data — return a
  // clear error and let the UI show "rates unavailable" instead of a number.
  if (goldError || silverError || !gold || !silver) {
    return NextResponse.json(
      { error: "rates_unavailable", message: "Could not load current gold/silver rates." },
      { status: 503 }
    );
  }

  // Previous-day comparison, pulled from rate_history (one row per metal per day).
  const { data: history } = await supabase
    .from("rate_history")
    .select("metal_type, rate, recorded_date")
    .in("metal_type", ["gold_24k", "gold_22k", "gold_20k", "gold_18k", "silver"])
    .order("recorded_date", { ascending: false })
    .limit(20);

  const previousFor = (metal: string) => {
    const rows = (history ?? []).filter((h) => h.metal_type === metal);
    // rows[0] is today's snapshot (if written), rows[1] is the prior day.
    return rows[1]?.rate ?? rows[0]?.rate;
  };

  const previous = history
    ? {
        gold_24k: previousFor("gold_24k") ?? gold.rate_24k,
        gold_22k: previousFor("gold_22k") ?? gold.rate_22k,
        gold_20k: previousFor("gold_20k") ?? gold.rate_20k,
        gold_18k: previousFor("gold_18k") ?? gold.rate_18k,
        silver: previousFor("silver") ?? silver.rate,
      }
    : undefined;

  const response: GoldRatesResponse = {
    gold_24k: gold.rate_24k,
    gold_22k: gold.rate_22k,
    gold_20k: gold.rate_20k,
    gold_18k: gold.rate_18k,
    silver: silver.rate,
    currency: "INR",
    gold_unit: gold.unit,
    silver_unit: silver.unit,
    updated_at: gold.effective_at,
    previous,
  };

  return NextResponse.json(response);
}
