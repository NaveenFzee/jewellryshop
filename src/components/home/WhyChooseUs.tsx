"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Eye, Gem, PenTool, Hammer, Repeat, PackageCheck, Headset } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

const POINTS = [
  { icon: ShieldCheck, title: "BIS Hallmarked", desc: "Every piece certified for purity." },
  { icon: Eye, title: "100% Transparency", desc: "Clear pricing, no hidden charges." },
  { icon: Gem, title: "Certified Diamonds", desc: "Independently graded stones." },
  { icon: PenTool, title: "Custom Jewellery", desc: "Your design, our craftsmanship." },
  { icon: Hammer, title: "Trusted Craftsmanship", desc: "Generations of artisan skill." },
  { icon: Repeat, title: "Easy Exchange", desc: "Transparent exchange policy." },
  { icon: PackageCheck, title: "Secure Packaging", desc: "Every order, safely delivered." },
  { icon: Headset, title: "After-Sales Service", desc: "We're here after the purchase too." },
];

export default function WhyChooseUs() {
  return (
    <section className="section-ivory py-24 px-4 md:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Our Promise" title="Why Choose Us" tone="ivory" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {POINTS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
              className="ivory-card p-6 text-center"
            >
              <p.icon className="mx-auto text-champagne-dark mb-3" size={26} strokeWidth={1.5} />
              <h3 className="font-display text-base text-ink mb-1">{p.title}</h3>
              <p className="text-xs text-ink/55">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
