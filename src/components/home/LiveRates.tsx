"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { GoldRatesResponse } from "@/lib/types";

const POLL_INTERVAL_MS = 60_000;

function HallmarkSeal({ live }: { live: boolean }) {
  return (
    <div className="relative flex items-center gap-2">
      <span className="relative flex h-2.5 w-2.5">
        {live && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-champagne opacity-60" />
        )}
        <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${live ? "bg-champagne" : "bg-ivory/30"}`} />
      </span>
      <span className="label-stamp">{live ? "Live Rate" : "Last Known Rate"}</span>
    </div>
  );
}

function RateFigure({
  label,
  value,
  previous,
  unit,
}: {
  label: string;
  value: number;
  previous?: number;
  unit: string;
}) {
  const diff = previous !== undefined ? value - previous : undefined;
  const pct = previous && diff !== undefined ? (diff / previous) * 100 : undefined;
  const direction = !diff ? "flat" : diff > 0 ? "up" : "down";

  return (
    <div className="glass-card px-6 py-8 flex flex-col items-center text-center min-w-[220px]">
      <span className="label-stamp mb-4">{label}</span>
      <div style={{ perspective: 400 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={value}
            initial={{ rotateX: -90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            exit={{ rotateX: 90, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="rate-digits text-3xl md:text-4xl text-ivory"
          >
            ₹{value.toLocaleString("en-IN")}
          </motion.div>
        </AnimatePresence>
      </div>
      <span className="text-xs text-ivory/45 mt-1.5">/ {unit}</span>

      {diff !== undefined && (
        <div
          className={`mt-4 flex items-center gap-1.5 text-sm font-mono ${
            direction === "up" ? "text-emerald-400" : direction === "down" ? "text-red-400" : "text-ivory/50"
          }`}
        >
          {direction === "up" && <TrendingUp size={14} />}
          {direction === "down" && <TrendingDown size={14} />}
          {direction === "flat" && <Minus size={14} />}
          <span>
            {diff === 0
              ? "No change"
              : `${diff > 0 ? "+" : "-"}₹${Math.abs(diff).toLocaleString("en-IN")} (${diff > 0 ? "+" : "-"}${Math.abs(
                  pct ?? 0
                ).toFixed(2)}%)`}
          </span>
        </div>
      )}
    </div>
  );
}

export default function LiveRates() {
  const [data, setData] = useState<GoldRatesResponse | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchRates = useCallback(async () => {
    try {
      const res = await fetch("/api/gold-rates", { cache: "no-store" });
      if (!res.ok) throw new Error("Rate fetch failed");
      const json: GoldRatesResponse = await res.json();
      setData(json);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchRates]);

  return (
    <section className="relative -mt-20 z-10 px-4 md:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="glass-card p-6 md:p-10 shadow-gold-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <HallmarkSeal live={!error && !loading} />
            {data && (
              <span className="text-xs text-ivory/45 font-mono">
                Last updated: {new Date(data.updated_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
              </span>
            )}
          </div>

          {loading && (
            <div className="grid sm:grid-cols-3 gap-5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="glass-card h-40 animate-pulse bg-white/[0.02]" />
              ))}
            </div>
          )}

          {!loading && error && !data && (
            <p className="text-center text-ivory/60 py-8">
              Rates are temporarily unavailable. Please check back shortly, or{" "}
              <a href="/contact" className="text-champagne underline">
                contact the store
              </a>{" "}
              for today&apos;s rate.
            </p>
          )}

          {data && (
            <div className="grid sm:grid-cols-3 gap-5">
              <RateFigure
                label="24K Gold"
                value={data.gold_24k}
                previous={data.previous?.gold_24k}
                unit={data.gold_unit}
              />
              <RateFigure
                label="22K Gold"
                value={data.gold_22k}
                previous={data.previous?.gold_22k}
                unit={data.gold_unit}
              />
              <RateFigure label="Silver" value={data.silver} previous={data.previous?.silver} unit={data.silver_unit} />
            </div>
          )}

          {error && data && (
            <p className="text-center text-xs text-ivory/40 mt-6">
              Showing the last successfully fetched rate — live updates are currently unavailable.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
