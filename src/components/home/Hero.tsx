"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import GoldButton from "@/components/ui/GoldButton";
import { siteConfig, whatsappLink } from "@/lib/config";
import { useMemo } from "react";

function GoldParticles() {
  // Deterministic-looking but varied particle positions, generated once.
  const particles = useMemo(
    () =>
      Array.from({ length: 22 }).map((_, i) => ({
        left: `${(i * 37) % 100}%`,
        delay: (i % 10) * 0.6,
        duration: 6 + (i % 5),
        driftX: `${((i % 7) - 3) * 12}px`,
        size: 2 + (i % 3),
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute bottom-0 rounded-full bg-champagne animate-drift"
          style={
            {
              left: p.left,
              width: p.size,
              height: p.size,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              "--drift-x": p.driftX,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden section-ink">
      <div className="absolute inset-0 bg-radial-glow" aria-hidden="true" />
      <GoldParticles />

      <div className="relative mx-auto max-w-7xl px-4 md:px-8 py-24 grid lg:grid-cols-2 gap-12 items-center w-full">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="gold-divider" />
            <span className="label-stamp">{siteConfig.city} · BIS Hallmarked</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium text-ivory leading-[1.05] text-balance">
            Timeless Elegance.
            <br />
            <span className="text-champagne">Crafted for You.</span>
          </h1>
          <p className="mt-6 text-ivory/70 text-base md:text-lg max-w-md">
            Discover exquisite gold and silver jewellery crafted with elegance, tradition and modern design —
            from {siteConfig.name}, {siteConfig.city}.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <GoldButton href="/jewellery" size="lg">
              Explore Collection
            </GoldButton>
            <GoldButton href="/contact" variant="outline" size="lg">
              Visit Our Store
            </GoldButton>
            <GoldButton
              href={whatsappLink(`Hi, I'd like to explore your jewellery collection.`)}
              variant="ghost"
              size="lg"
            >
              WhatsApp Us
            </GoldButton>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="relative aspect-[4/5] rounded-3xl overflow-hidden glass-card"
        >
          <Image
            src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1200&auto=format&fit=crop"
            alt="Featured gold jewellery piece"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </motion.div>
      </div>
    </section>
  );
}
