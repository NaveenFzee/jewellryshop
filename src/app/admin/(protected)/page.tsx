import Link from "next/link";
import { Gem, Tag, TrendingUp, MessageSquare, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatINR } from "@/lib/pricing";

async function getStats() {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  const [
    { count: totalProducts },
    { count: activeOffers },
    { data: goldRate },
    { data: silverRate },
    { count: newEnquiries },
    { count: customRequests },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase
      .from("offers")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true)
      .lte("valid_from", today)
      .gte("valid_until", today),
    supabase.from("gold_rates").select("*").order("effective_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("silver_rates").select("*").order("effective_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("enquiries").select("*", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("custom_jewellery_requests").select("*", { count: "exact", head: true }).eq("status", "new"),
  ]);

  return { totalProducts, activeOffers, goldRate, silverRate, newEnquiries, customRequests };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    { label: "Total Active Products", value: stats.totalProducts ?? 0, icon: Gem, href: "/admin/products" },
    { label: "Active Offers", value: stats.activeOffers ?? 0, icon: Tag, href: "/admin/offers" },
    {
      label: "Today's 22K Gold Rate",
      value: stats.goldRate ? formatINR(stats.goldRate.rate_22k) : "Not set",
      icon: TrendingUp,
      href: "/admin/rates",
    },
    {
      label: "Today's Silver Rate",
      value: stats.silverRate ? formatINR(stats.silverRate.rate) : "Not set",
      icon: TrendingUp,
      href: "/admin/rates",
    },
    { label: "New Enquiries", value: stats.newEnquiries ?? 0, icon: MessageSquare, href: "/admin/enquiries" },
    { label: "New Custom Requests", value: stats.customRequests ?? 0, icon: Sparkles, href: "/admin/enquiries" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl text-ink mb-8">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="ivory-card p-6 hover:border-champagne transition-colors">
            <c.icon className="text-champagne-dark mb-3" size={22} />
            <p className="text-2xl font-display text-ink">{c.value}</p>
            <p className="text-xs text-ink/50 mt-1">{c.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
