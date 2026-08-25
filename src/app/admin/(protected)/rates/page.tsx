import { createClient } from "@/lib/supabase/server";
import RateForm from "@/components/admin/RateForm";
import { formatINR } from "@/lib/pricing";

export default async function AdminRatesPage() {
  const supabase = await createClient();
  const [{ data: gold }, { data: silver }] = await Promise.all([
    supabase.from("gold_rates").select("*").order("effective_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("silver_rates").select("*").order("effective_at", { ascending: false }).limit(1).maybeSingle(),
  ]);

  return (
    <div>
      <h1 className="font-display text-3xl text-ink mb-2">Gold & Silver Rates</h1>
      <p className="text-sm text-ink/50 mb-8">
        Updating here writes a new current rate AND today&apos;s history point — both the live rate board and
        the historical chart update immediately.
      </p>

      <div className="grid md:grid-cols-2 gap-6 max-w-3xl">
        <div className="ivory-card p-6">
          <h2 className="font-display text-lg text-ink mb-1">Gold Rate</h2>
          {gold && (
            <p className="text-xs text-ink/40 mb-4">
              Current: 24K {formatINR(gold.rate_24k)} · 22K {formatINR(gold.rate_22k)} · 20K {formatINR(gold.rate_20k)} · 18K{" "}
              {formatINR(gold.rate_18k)}
            </p>
          )}
          <RateForm type="gold" defaults={gold ?? undefined} />
        </div>

        <div className="ivory-card p-6">
          <h2 className="font-display text-lg text-ink mb-1">Silver Rate</h2>
          {silver && <p className="text-xs text-ink/40 mb-4">Current: {formatINR(silver.rate)} / kg</p>}
          <RateForm type="silver" defaults={silver ?? undefined} />
        </div>
      </div>

      <div className="mt-10 max-w-3xl ivory-card p-6">
        <h2 className="font-display text-lg text-ink mb-2">Wiring an automatic rate provider</h2>
        <p className="text-sm text-ink/60">
          This form is the manual path and always works. To automate it, add a scheduled job (Vercel Cron or a
          Supabase Edge Function on a schedule) that calls a rate provider API and performs the same two writes
          this form does — see README &ldquo;Wiring a live rate provider&rdquo; for the exact steps.
        </p>
      </div>
    </div>
  );
}
