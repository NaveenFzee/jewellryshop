import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const RANGE_DAYS: Record<string, number> = {
  "1d": 1,
  "7d": 7,
  "30d": 30,
  "3m": 90,
  "1y": 365,
};

const VALID_METALS = ["gold_24k", "gold_22k", "gold_20k", "gold_18k", "silver"];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const metal = searchParams.get("metal") ?? "gold_22k";
  const range = searchParams.get("range") ?? "30d";

  if (!VALID_METALS.includes(metal)) {
    return NextResponse.json({ error: "invalid metal" }, { status: 400 });
  }

  const days = RANGE_DAYS[range] ?? 30;
  const since = new Date();
  since.setDate(since.getDate() - days);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rate_history")
    .select("rate, recorded_date")
    .eq("metal_type", metal)
    .gte("recorded_date", since.toISOString().slice(0, 10))
    .order("recorded_date", { ascending: true });

  if (error) {
    return NextResponse.json({ error: "could not load history" }, { status: 503 });
  }

  return NextResponse.json({ metal, range, points: data ?? [] });
}
