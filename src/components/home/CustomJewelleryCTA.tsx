"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import GoldButton from "@/components/ui/GoldButton";
import { submitCustomJewelleryRequest, type ActionResult } from "@/lib/actions";

const initialState: ActionResult | null = null;

export default function CustomJewelleryCTA() {
  const [state, formAction, isPending] = useActionState(submitCustomJewelleryRequest, initialState);

  return (
    <section className="section-ivory py-24 px-4 md:px-8">
      <div className="mx-auto max-w-4xl">
        <SectionHeading eyebrow="Bespoke" title="Have a Design in Mind?" tone="ivory" />

        {state?.success ? (
          <div className="ivory-card p-10 text-center max-w-lg mx-auto">
            <CheckCircle2 className="mx-auto text-emerald-600 mb-4" size={40} />
            <p className="font-display text-xl text-ink">{state.message}</p>
          </div>
        ) : (
          <form action={formAction} className="ivory-card p-6 md:p-10 grid md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label htmlFor="jewelleryType" className="text-xs font-label uppercase tracking-wider text-ink/60">
                Jewellery Type
              </label>
              <select
                id="jewelleryType"
                name="jewelleryType"
                className="mt-2 w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-sm focus-visible:outline-champagne"
              >
                <option value="">Select a type</option>
                <option>Ring</option>
                <option>Necklace</option>
                <option>Earrings</option>
                <option>Bangle</option>
                <option>Bridal Set</option>
                <option>Other</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="requirement" className="text-xs font-label uppercase tracking-wider text-ink/60">
                Describe Your Requirement
              </label>
              <textarea
                id="requirement"
                name="requirement"
                rows={4}
                className="mt-2 w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-sm focus-visible:outline-champagne"
                placeholder="Tell us about the design, occasion, or reference you have in mind"
              />
            </div>

            <div>
              <label htmlFor="budgetRange" className="text-xs font-label uppercase tracking-wider text-ink/60">
                Approximate Budget
              </label>
              <input
                id="budgetRange"
                name="budgetRange"
                type="text"
                placeholder="e.g. ₹50,000 – ₹1,00,000"
                className="mt-2 w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-sm focus-visible:outline-champagne"
              />
            </div>
            <div>
              <label htmlFor="name" className="text-xs font-label uppercase tracking-wider text-ink/60">
                Your Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-2 w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-sm focus-visible:outline-champagne"
              />
            </div>

            <div>
              <label htmlFor="phone" className="text-xs font-label uppercase tracking-wider text-ink/60">
                Phone Number *
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                className="mt-2 w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-sm focus-visible:outline-champagne"
              />
            </div>
            <div>
              <label htmlFor="whatsapp" className="text-xs font-label uppercase tracking-wider text-ink/60">
                WhatsApp Number
              </label>
              <input
                id="whatsapp"
                name="whatsapp"
                type="tel"
                className="mt-2 w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-sm focus-visible:outline-champagne"
              />
            </div>

            {state && !state.success && <p className="md:col-span-2 text-sm text-oxblood">{state.message}</p>}

            <div className="md:col-span-2 flex justify-center mt-2">
              <GoldButton type="submit" size="lg" disabled={isPending}>
                {isPending ? "Submitting…" : "Submit Enquiry"}
              </GoldButton>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
