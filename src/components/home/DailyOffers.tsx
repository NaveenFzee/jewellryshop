import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import SectionHeading from "@/components/ui/SectionHeading";
import GoldButton from "@/components/ui/GoldButton";
import { whatsappLink } from "@/lib/config";
import type { Offer } from "@/lib/types";

function isEndingToday(validUntil: string) {
  const today = new Date().toDateString();
  return new Date(validUntil).toDateString() === today;
}

export default async function DailyOffers() {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data: offers } = await supabase
    .from("offers")
    .select("*")
    .eq("is_active", true)
    .lte("valid_from", today)
    .gte("valid_until", today)
    .order("valid_until", { ascending: true })
    .limit(6);

  const list = (offers ?? []) as Offer[];

  if (list.length === 0) return null;

  return (
    <section className="section-ivory py-24 px-4 md:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Today's Offers" title="Curated Value, Every Visit" tone="ivory" />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((offer) => (
            <div key={offer.id} className="ivory-card overflow-hidden flex flex-col">
              <div className="relative h-44">
                <Image
                  src={
                    offer.banner_image_url ||
                    "https://images.unsplash.com/photo-1611955167811-4711904bb9f8?q=80&w=800&auto=format&fit=crop"
                  }
                  alt={offer.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                {isEndingToday(offer.valid_until) && (
                  <span className="absolute top-3 right-3 bg-oxblood text-ivory text-[10px] font-label tracking-wider uppercase px-3 py-1 rounded-full">
                    Ends Today
                  </span>
                )}
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-display text-xl text-ink mb-2">{offer.title}</h3>
                {offer.description && <p className="text-sm text-ink/60 mb-3 flex-1">{offer.description}</p>}
                {offer.discount_text && (
                  <p className="text-champagne-dark font-label text-sm mb-3">{offer.discount_text}</p>
                )}
                <p className="text-xs text-ink/40 mb-4">
                  Valid till {new Date(offer.valid_until).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  {offer.terms_conditions ? " · T&C apply" : ""}
                </p>
                <GoldButton
                  href={whatsappLink(`Hi, I'd like to know more about the offer: ${offer.title}`)}
                  variant="outline"
                  size="sm"
                  className="mt-auto"
                >
                  Enquire on WhatsApp
                </GoldButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
