"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Heart, MessageCircle, Phone, Menu, X } from "lucide-react";
import { clsx } from "clsx";
import { siteConfig, whatsappLink, telLink } from "@/lib/config";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Jewellery", href: "/jewellery" },
  { label: "Collections", href: "/collections" },
  { label: "Gold", href: "/jewellery/gold" },
  { label: "Silver", href: "/jewellery/silver" },
  { label: "Services", href: "/services" },
  { label: "Offers", href: "/offers" },
  { label: "Gold Rate", href: "/gold-rate" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={clsx(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-ink/90 backdrop-blur-xl border-b border-champagne/15 shadow-[0_4px_30px_-10px_rgba(0,0,0,0.6)]"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="font-display text-2xl md:text-3xl text-ivory tracking-wide">
            {siteConfig.name}
          </Link>

          <nav className="hidden xl:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-label text-[11px] tracking-[0.12em] uppercase text-ivory/80 hover:text-champagne transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 md:gap-2">
            <button
              aria-label="Search"
              className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full text-ivory/80 hover:text-champagne hover:bg-white/5 transition-colors"
            >
              <Search size={18} />
            </button>
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full text-ivory/80 hover:text-champagne hover:bg-white/5 transition-colors"
            >
              <Heart size={18} />
            </Link>
            <a
              href={whatsappLink(`Hi, I'd like to know more about ${siteConfig.name}.`)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp us"
              className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full text-ivory/80 hover:text-champagne hover:bg-white/5 transition-colors"
            >
              <MessageCircle size={18} />
            </a>
            <a
              href={telLink()}
              aria-label="Call us"
              className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full text-ivory/80 hover:text-champagne hover:bg-white/5 transition-colors"
            >
              <Phone size={18} />
            </a>
            <button
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
              className="xl:hidden inline-flex h-10 w-10 items-center justify-center rounded-full text-ivory hover:text-champagne"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <div
        className={clsx(
          "fixed inset-0 z-[60] xl:hidden transition-opacity duration-300",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="absolute inset-0 bg-ink/95 backdrop-blur-xl" onClick={() => setMobileOpen(false)} />
        <div className="relative h-full flex flex-col px-6 py-8">
          <div className="flex justify-between items-center mb-10">
            <span className="font-display text-2xl text-ivory">{siteConfig.name}</span>
            <button aria-label="Close menu" onClick={() => setMobileOpen(false)} className="text-ivory">
              <X size={26} />
            </button>
          </div>
          <nav className="flex flex-col gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="font-display text-2xl text-ivory/90 hover:text-champagne transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
