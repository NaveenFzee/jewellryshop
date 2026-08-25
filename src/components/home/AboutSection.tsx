import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import { siteConfig } from "@/lib/config";

const PILLARS = [
  { label: "Experience", value: "Decades of craft" },
  { label: "Trust", value: "Generations of customers" },
  { label: "Quality", value: "Hallmark certified" },
  { label: "Service", value: "Lifetime after-care" },
];

export default function AboutSection() {
  return (
    <section className="section-ivory py-24 px-4 md:px-8">
      <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-16 items-center">
        <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1600353568525-88eef31c1a45?q=80&w=1000&auto=format&fit=crop"
            alt={`Inside ${siteConfig.name}`}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        <div>
          <SectionHeading eyebrow="Our Story" title={`The ${siteConfig.name} Legacy`} align="left" tone="ivory" />
          <p className="text-ink/70 leading-relaxed mb-6">
            What began as a small family counter in {siteConfig.city} has grown into a name customers trust
            for honest weighing, fair making charges, and jewellery that's built to last. Every piece that
            leaves our store carries the same care our founders put into their very first sale.
          </p>
          <p className="text-ink/70 leading-relaxed mb-10">
            Our artisans train for years before a single piece bears our name — because in jewellery,
            craftsmanship isn't a feature, it's the whole promise.
          </p>
          <div className="grid grid-cols-2 gap-6">
            {PILLARS.map((p) => (
              <div key={p.label} className="border-l-2 border-champagne pl-4">
                <p className="font-display text-lg text-ink">{p.value}</p>
                <p className="text-xs font-label uppercase tracking-wider text-ink/45 mt-1">{p.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
