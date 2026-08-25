"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

// Placeholder testimonials — replace with real reviews (or pull from a
// `reviews` table / Google Business API integration) before launch.
const REVIEWS = [
  {
    name: "Priya M.",
    text: "Bought my wedding set here — the making charges were transparent and the finish is beautiful. Two years on, still get compliments.",
  },
  {
    name: "Arvind K.",
    text: "Exchanged old gold for a new chain. The valuation was fair and explained clearly, no pressure to buy more than we needed.",
  },
  {
    name: "Lakshmi R.",
    text: "Custom-designed a pendant from a family sketch. The team got every detail right and kept us updated through the process.",
  },
];

export default function Testimonials() {
  return (
    <section className="section-ink py-24 px-4 md:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Customer Stories" title="What Our Customers Say" />
        <div className="grid md:grid-cols-3 gap-6">
          {REVIEWS.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card p-7"
            >
              <div className="flex gap-1 mb-4 text-champagne">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} size={14} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <p className="text-ivory/75 text-sm leading-relaxed mb-5">&ldquo;{r.text}&rdquo;</p>
              <p className="font-label text-xs tracking-wider uppercase text-champagne">{r.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
