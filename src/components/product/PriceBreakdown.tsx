import type { PricingBreakdown } from "@/lib/pricing";
import { formatINR } from "@/lib/pricing";

export default function PriceBreakdown({
  breakdown,
  ratePerGram,
  purity,
  netWeight,
  makingChargeType,
  makingChargeValue,
  gstPercentage,
}: {
  breakdown: PricingBreakdown;
  ratePerGram: number;
  purity: string;
  netWeight: number;
  makingChargeType: "percentage" | "fixed";
  makingChargeValue: number;
  gstPercentage: number;
}) {
  const rows: [string, string][] = [
    [`Gold Value (${netWeight}g × ${formatINR(ratePerGram)}/g, ${purity})`, formatINR(breakdown.goldValue)],
    [
      `Making Charge (${makingChargeType === "percentage" ? `${makingChargeValue}%` : "fixed"})`,
      formatINR(breakdown.makingCharge),
    ],
    ["Stone Charge", formatINR(breakdown.stoneValue)],
    ["Subtotal", formatINR(breakdown.subtotal)],
    [`GST (${gstPercentage}%)`, formatINR(breakdown.gstAmount)],
  ];

  return (
    <div className="ivory-card p-6">
      <p className="label-stamp mb-4">Estimated Price Breakdown</p>
      <dl className="space-y-2.5">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between text-sm">
            <dt className="text-ink/60">{label}</dt>
            <dd className="text-ink font-medium tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 pt-4 border-t border-ink/10 flex justify-between items-baseline">
        <span className="font-label text-xs uppercase tracking-wider text-ink/60">Final Estimated Price</span>
        <span className="font-display text-2xl text-champagne-dark tabular-nums">{formatINR(breakdown.finalPrice)}</span>
      </div>
      <p className="text-xs text-ink/45 mt-4">
        Final price may vary based on the actual product, gold rate and making charges at the time of purchase.
      </p>
    </div>
  );
}
