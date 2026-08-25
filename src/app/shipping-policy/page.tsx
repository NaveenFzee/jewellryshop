import type { Metadata } from "next";

export const metadata: Metadata = { title: "Shipping Policy" };

export default function ShippingPolicyPage() {
  return (
    <div className="section-ivory min-h-screen py-20 px-4 md:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-4xl text-ink mb-6">Shipping Policy</h1>
        <p className="text-ink/60 text-sm mb-8">Placeholder text — replace with your actual shipping terms before launch.</p>
        <div className="space-y-6 text-ink/75 leading-relaxed">
          <p>Insured shipping is available for select items — contact our team to confirm availability and cost for your location.</p>
          <p>All shipments are packed securely and tracked from dispatch to delivery.</p>
        </div>
      </div>
    </div>
  );
}
