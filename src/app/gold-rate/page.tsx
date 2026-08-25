import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import RateHistoryChart from "@/components/product/RateHistoryChart";
import SectionHeading from "@/components/ui/SectionHeading";
import { formatINR } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Today's Gold & Silver Rate",
  description: "Live 24K, 22K, 20K, 18K gold rate and silver rate, updated daily, with historical price charts.",
};

export const revalidate = 60;

export default async function GoldRatePage() {
  const supabase = await createClient();
  const [{ data: gold }, { data: silver }] = await Promise.all([
    supabase.from("gold_rates").select("*").order("effective_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("silver_rates").select("*").order("effective_at", { ascending: false }).limit(1).maybeSingle(),
  ]);

  const rows = gold
    ? [
        { label: "24K Gold", rate: gold.rate_24k, unit: gold.unit },
        { label: "22K Gold", rate: gold.rate_22k, unit: gold.unit },
        { label: "20K Gold", rate: gold.rate_20k, unit: gold.unit },
        { label: "18K Gold", rate: gold.rate_18k, unit: gold.unit },
      ]
    : [];
  if (silver) rows.push({ label: "Silver", rate: silver.rate, unit: silver.unit });

  return (
    <div className="section-ink min-h-screen py-20 px-4 md:px-8">
      <div className="mx-auto max-w-5xl">
        <SectionHeading eyebrow="Updated Daily" title="Today's Gold & Silver Rate" />

        {!gold || !silver ? (
          <p className="text-center text-ivory/60 glass-card p-8">
            Rates are temporarily unavailable. Please contact the store for today&apos;s rate.
          </p>
        ) : (
          <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-14">
            {rows.map((r) => (
              <div key={r.label} className="glass-card p-5 text-center">
                <p className="label-stamp mb-3">{r.label}</p>
                <p className="rate-digits text-2xl text-ivory">{formatINR(r.rate)}</p>
                <p className="text-xs text-ivory/40 mt-1">/ {r.unit}</p>
              </div>
            ))}
          </div>
        )}

        <RateHistoryChart />

        <p className="text-center text-xs text-ivory/35 mt-8">
          {gold ? `Last updated: ${new Date(gold.effective_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}` : ""}
          {" · "}Rates are indicative and subject to change. Final billing rate is confirmed in-store at the time of purchase.
        </p>
      </div>
    </div>
  );
}
