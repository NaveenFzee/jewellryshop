import SectionHeading from "@/components/ui/SectionHeading";
import GoldButton from "@/components/ui/GoldButton";
import { siteConfig, telLink, whatsappLink } from "@/lib/config";
import { Clock, MapPin, Phone, MessageCircle } from "lucide-react";

const HOURS = [
  { day: "Monday – Saturday", time: "10:00 AM – 8:30 PM" },
  { day: "Sunday", time: "11:00 AM – 7:00 PM" },
];

export default function StoreLocation() {
  const mapsQuery = encodeURIComponent(`${siteConfig.address}, ${siteConfig.city}, ${siteConfig.state}`);

  return (
    <section className="section-ivory py-24 px-4 md:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Visit Us" title="Our Store" tone="ivory" />
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="rounded-2xl overflow-hidden border border-champagne/25 h-80 lg:h-auto">
            <iframe
              title="Store location map"
              className="w-full h-full min-h-[320px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${mapsQuery}&output=embed`}
            />
          </div>

          <div className="ivory-card p-8 flex flex-col justify-center">
            <div className="flex gap-4 mb-6">
              <MapPin className="text-champagne-dark shrink-0 mt-1" size={20} />
              <div>
                <p className="font-label text-xs uppercase tracking-wider text-ink/45 mb-1">Address</p>
                <p className="text-ink/80">
                  {siteConfig.address}
                  <br />
                  {siteConfig.city}, {siteConfig.state}
                </p>
              </div>
            </div>
            <div className="flex gap-4 mb-6">
              <Clock className="text-champagne-dark shrink-0 mt-1" size={20} />
              <div>
                <p className="font-label text-xs uppercase tracking-wider text-ink/45 mb-1">Business Hours</p>
                {HOURS.map((h) => (
                  <p key={h.day} className="text-ink/80 text-sm">
                    {h.day}: {h.time}
                  </p>
                ))}
              </div>
            </div>
            <div className="flex gap-4 mb-8">
              <Phone className="text-champagne-dark shrink-0 mt-1" size={20} />
              <div>
                <p className="font-label text-xs uppercase tracking-wider text-ink/45 mb-1">Contact</p>
                <p className="text-ink/80 text-sm">{siteConfig.phone}</p>
                <p className="text-ink/80 text-sm">{siteConfig.email}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <GoldButton href={telLink()} variant="outline" size="sm">
                <Phone size={14} /> Call Store
              </GoldButton>
              <GoldButton href={whatsappLink("Hi, I'd like to visit your store.")} size="sm">
                <MessageCircle size={14} /> WhatsApp
              </GoldButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
