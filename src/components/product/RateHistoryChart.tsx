"use client";

import { useEffect, useState, useCallback } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { clsx } from "clsx";

const RANGES = [
  { value: "1d", label: "1 Day" },
  { value: "7d", label: "7 Days" },
  { value: "30d", label: "30 Days" },
  { value: "3m", label: "3 Months" },
  { value: "1y", label: "1 Year" },
];

const METALS = [
  { value: "gold_24k", label: "24K Gold" },
  { value: "gold_22k", label: "22K Gold" },
  { value: "gold_20k", label: "20K Gold" },
  { value: "gold_18k", label: "18K Gold" },
  { value: "silver", label: "Silver" },
];

interface Point {
  rate: number;
  recorded_date: string;
}

export default function RateHistoryChart() {
  const [metal, setMetal] = useState("gold_22k");
  const [range, setRange] = useState("30d");
  const [points, setPoints] = useState<Point[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/rate-history?metal=${metal}&range=${range}`, { cache: "no-store" });
      const json = await res.json();
      setPoints(json.points ?? []);
    } catch {
      setPoints([]);
    } finally {
      setLoading(false);
    }
  }, [metal, range]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const chartData = points.map((p) => ({
    date: new Date(p.recorded_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    rate: p.rate,
  }));

  return (
    <div className="glass-card p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {METALS.map((m) => (
            <button
              key={m.value}
              onClick={() => setMetal(m.value)}
              className={clsx(
                "text-xs px-3 py-1.5 rounded-full border transition-colors",
                metal === m.value ? "bg-champagne text-ink border-champagne" : "border-champagne/25 text-ivory/60 hover:text-champagne"
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {RANGES.map((r) => (
            <button
              key={r.value}
              onClick={() => setRange(r.value)}
              className={clsx(
                "text-xs px-3 py-1.5 rounded-full border transition-colors",
                range === r.value ? "bg-champagne text-ink border-champagne" : "border-champagne/25 text-ivory/60 hover:text-champagne"
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-72">
        {loading ? (
          <div className="h-full flex items-center justify-center text-ivory/40 text-sm">Loading chart…</div>
        ) : chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-ivory/40 text-sm text-center px-6">
            No historical data yet for this range. Rate history builds up as the admin updates rates daily — see
            README &ldquo;Recording rate history&rdquo;.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,163,91,0.12)" />
              <XAxis dataKey="date" stroke="rgba(248,244,234,0.4)" fontSize={11} tickLine={false} />
              <YAxis
                stroke="rgba(248,244,234,0.4)"
                fontSize={11}
                tickLine={false}
                domain={["auto", "auto"]}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{ background: "#12151D", border: "1px solid rgba(201,163,91,0.3)", borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: "#F8F4EA" }}
                formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, "Rate"]}
              />
              <Line type="monotone" dataKey="rate" stroke="#C9A35B" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
