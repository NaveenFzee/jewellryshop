"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Phone, ArrowUp } from "lucide-react";
import { siteConfig, whatsappLink, telLink } from "@/lib/config";

export default function FloatingButtons() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed bottom-6 right-5 z-40 flex flex-col items-end gap-3">
      {showTop && (
        <button
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="h-11 w-11 rounded-full bg-ink border border-champagne/40 text-champagne flex items-center justify-center shadow-gold hover:-translate-y-0.5 transition-transform"
        >
          <ArrowUp size={18} />
        </button>
      )}
      <a
        href={telLink()}
        aria-label="Call us"
        className="h-12 w-12 rounded-full bg-ink border border-champagne/40 text-champagne flex items-center justify-center shadow-gold hover:-translate-y-0.5 transition-transform"
      >
        <Phone size={19} />
      </a>
      <a
        href={whatsappLink(`Hi, I'd like to know more about ${siteConfig.name}.`)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="h-14 w-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_8px_30px_-8px_rgba(37,211,102,0.6)] hover:-translate-y-0.5 transition-transform"
      >
        <MessageCircle size={24} />
      </a>
    </div>
  );
}
