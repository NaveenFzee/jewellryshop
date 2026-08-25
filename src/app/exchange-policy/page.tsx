import type { Metadata } from "next";

export const metadata: Metadata = { title: "Exchange Policy" };

export default function ExchangePolicyPage() {
  return (
    <div className="section-ivory min-h-screen py-20 px-4 md:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-4xl text-ink mb-6">Exchange Policy</h1>
        <p className="text-ink/60 text-sm mb-8">Placeholder text — replace with your actual exchange terms before launch.</p>
        <div className="space-y-6 text-ink/75 leading-relaxed">
          <p>We offer transparent gold exchange at prevailing rates, with purity verified in front of you.</p>
          <p>Visit your nearest store with the item and original invoice (if available) to begin an exchange.</p>
        </div>
      </div>
    </div>
  );
}
