import * as Icons from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import SectionHeading from "@/components/ui/SectionHeading";
import { whatsappLink } from "@/lib/config";
import type { Service } from "@/lib/types";
import type { LucideIcon } from "lucide-react";

function resolveIcon(name: string | null): LucideIcon {
  if (!name) return Icons.Gem;
  const icon = (Icons as unknown as Record<string, LucideIcon>)[name];
  return icon ?? Icons.Gem;
}

export default async function Services() {
  const supabase = await createClient();
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  const list = (services ?? []) as Service[];
  if (list.length === 0) return null;

  return (
    <section className="section-ink py-24 px-4 md:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Beyond the Sale" title="Our Services" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map((s) => {
            const Icon = resolveIcon(s.icon_name);
            return (
              <div key={s.id} className="glass-card p-7">
                <Icon className="text-champagne mb-4" size={28} strokeWidth={1.5} />
                <h3 className="font-display text-xl text-ivory mb-2">{s.name}</h3>
                {s.description && <p className="text-sm text-ivory/60 mb-5">{s.description}</p>}
                <a
                  href={whatsappLink(`Hi, I'd like to enquire about ${s.name}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-label tracking-wider uppercase text-champagne hover:underline"
                >
                  Enquire →
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
