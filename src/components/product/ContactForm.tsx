"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import GoldButton from "@/components/ui/GoldButton";
import { submitEnquiry, type ActionResult } from "@/lib/actions";

const initialState: ActionResult | null = null;

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitEnquiry, initialState);

  if (state?.success) {
    return (
      <div className="ivory-card p-10 text-center">
        <CheckCircle2 className="mx-auto text-emerald-600 mb-4" size={40} />
        <p className="font-display text-xl text-ink">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="ivory-card p-6 md:p-10 space-y-5">
      <div>
        <label htmlFor="name" className="text-xs font-label uppercase tracking-wider text-ink/60">
          Name *
        </label>
        <input
          id="name"
          name="name"
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
        <label htmlFor="message" className="text-xs font-label uppercase tracking-wider text-ink/60">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="mt-2 w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-sm focus-visible:outline-champagne"
        />
      </div>
      {state && !state.success && <p className="text-sm text-oxblood">{state.message}</p>}
      <GoldButton type="submit" size="lg" disabled={isPending}>
        {isPending ? "Sending…" : "Send Message"}
      </GoldButton>
    </form>
  );
}
