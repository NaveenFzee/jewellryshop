import type { Metadata } from "next";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import SectionHeading from "@/components/ui/SectionHeading";
import { whatsappLink } from "@/lib/config";
import type { Service } from "@/lib/types";

export const metadata: Metadata = { title: "Services" };

function resolveIcon(name: string | null): LucideIcon {
  if (!name) return Icons.Gem;
  return (Icons as unknown as Record<string, LucideIcon>)[name] ?? Icons.Gem;
}

export default async function ServicesPage() {
  const supabase = await createClient();
  const { data: services } = await supabase.from("services").select("*").eq("is_active", true).order("display_order");
  const list = (services ?? []) as Service[];

  return (
    <div className="section-ink min-h-screen py-20 px-4 md:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Beyond the Sale" title="Our Services" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((s) => {
            const Icon = resolveIcon(s.icon_name);
            return (
              <div key={s.id} className="glass-card p-8">
                <Icon className="text-champagne mb-4" size={30} strokeWidth={1.5} />
                <h2 className="font-display text-2xl text-ivory mb-3">{s.name}</h2>
                {s.description && <p className="text-sm text-ivory/60 mb-6 leading-relaxed">{s.description}</p>}
                <a
                  href={whatsappLink(`Hi, I'd like to enquire about ${s.name}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-label tracking-wider uppercase text-champagne hover:underline"
                >
                  Enquire on WhatsApp →
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
