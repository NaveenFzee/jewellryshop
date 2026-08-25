import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <div className="section-ivory min-h-screen py-20 px-4 md:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-4xl text-ink mb-6">Terms & Conditions</h1>
        <p className="text-ink/60 text-sm mb-8">
          Placeholder text — replace with legally reviewed terms specific to {siteConfig.name} before launch.
        </p>
        <div className="space-y-6 text-ink/75 leading-relaxed">
          <p>
            Product prices shown on this site are estimates calculated from the displayed gold/silver rate and
            configured making charges. The final price is confirmed in-store at the time of purchase, based on
            the day&apos;s rate and the actual piece selected.
          </p>
          <p>All jewellery is sold with applicable hallmarking and certification as described on the product page.</p>
          <p>By submitting an enquiry or custom order request, you agree to be contacted by our team via phone or WhatsApp regarding your request.</p>
        </div>
      </div>
    </div>
  );
}
