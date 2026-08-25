import Link from "next/link";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { siteConfig } from "@/lib/config";

const QUICK_LINKS = [
  { label: "Jewellery", href: "/jewellery" },
  { label: "Collections", href: "/collections" },
  { label: "Services", href: "/services" },
  { label: "Offers", href: "/offers" },
  { label: "Gold Rate", href: "/gold-rate" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const SUPPORT_LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Shipping Policy", href: "/shipping-policy" },
  { label: "Exchange Policy", href: "/exchange-policy" },
];

export default function Footer() {
  return (
    <footer className="section-ink border-t border-champagne/15">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div>
            <span className="font-display text-2xl text-ivory">{siteConfig.name}</span>
            <p className="mt-3 text-sm text-ivory/60 max-w-xs">{siteConfig.tagline}</p>
            <div className="flex gap-3 mt-6">
              {[Facebook, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="h-9 w-9 flex items-center justify-center rounded-full border border-champagne/25 text-champagne hover:bg-champagne/10 transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="label-stamp mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {QUICK_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-ivory/70 hover:text-champagne transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="label-stamp mb-5">Customer Support</h4>
            <ul className="space-y-3">
              {SUPPORT_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-ivory/70 hover:text-champagne transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="label-stamp mb-5">Visit Us</h4>
            <p className="text-sm text-ivory/70 leading-relaxed">
              {siteConfig.address}
              <br />
              {siteConfig.city}, {siteConfig.state}
            </p>
            <p className="text-sm text-ivory/70 mt-3">{siteConfig.phone}</p>
            <p className="text-sm text-ivory/70">{siteConfig.email}</p>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-champagne/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-ivory/40">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-xs text-ivory/40 font-label tracking-wider">BIS HALLMARKED · 100% TRANSPARENCY</p>
        </div>
      </div>
    </footer>
  );
}
