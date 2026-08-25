"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { LayoutDashboard, Gem, Tag, TrendingUp, MessageSquare, LogOut, ExternalLink } from "lucide-react";
import { signOutAdmin } from "@/lib/admin-actions-products";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Gem },
  { href: "/admin/offers", label: "Offers", icon: Tag },
  { href: "/admin/rates", label: "Gold/Silver Rates", icon: TrendingUp },
  { href: "/admin/enquiries", label: "Enquiries", icon: MessageSquare },
];

export default function AdminSidebar({ adminName }: { adminName: string }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 section-ink border-r border-champagne/15 min-h-screen flex flex-col p-6">
      <div className="mb-10">
        <p className="font-display text-xl text-ivory">Admin Panel</p>
        <p className="text-xs text-ivory/40 mt-1">{adminName}</p>
      </div>

      <nav className="flex-1 space-y-1">
        {LINKS.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                active ? "bg-champagne/15 text-champagne" : "text-ivory/65 hover:bg-white/5 hover:text-ivory"
              )}
            >
              <link.icon size={16} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 pt-6 border-t border-champagne/10">
        <Link href="/" target="_blank" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-ivory/55 hover:text-ivory hover:bg-white/5">
          <ExternalLink size={16} /> View Site
        </Link>
        <form action={signOutAdmin}>
          <button type="submit" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-ivory/55 hover:text-red-400 hover:bg-white/5">
            <LogOut size={16} /> Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
