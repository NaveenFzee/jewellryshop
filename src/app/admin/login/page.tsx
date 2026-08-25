"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Lock } from "lucide-react";
import GoldButton from "@/components/ui/GoldButton";
import { signInAdmin } from "@/lib/admin-actions-products";
import { siteConfig } from "@/lib/config";
import type { ActionResult } from "@/lib/actions";

const initialState: ActionResult | null = null;

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(signInAdmin, initialState);
  const searchParams = useSearchParams();
  const notAdminError = searchParams.get("error") === "not_admin";

  return (
    <div className="section-ink min-h-screen flex items-center justify-center px-4">
      <div className="glass-card p-8 md:p-10 w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 rounded-full border border-champagne/40 flex items-center justify-center mb-4">
            <Lock size={18} className="text-champagne" />
          </div>
          <h1 className="font-display text-2xl text-ivory">{siteConfig.name}</h1>
          <p className="label-stamp mt-1">Admin Login</p>
        </div>

        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="email" className="text-xs font-label uppercase tracking-wider text-ivory/50">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-2 w-full rounded-lg border border-champagne/25 bg-white/5 px-4 py-3 text-sm text-ivory focus-visible:outline-champagne"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-xs font-label uppercase tracking-wider text-ivory/50">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-2 w-full rounded-lg border border-champagne/25 bg-white/5 px-4 py-3 text-sm text-ivory focus-visible:outline-champagne"
            />
          </div>

          {notAdminError && (
            <p className="text-sm text-red-400">You&apos;re signed in, but this account isn&apos;t authorized for admin access.</p>
          )}
          {state && !state.success && <p className="text-sm text-red-400">{state.message}</p>}

          <GoldButton type="submit" size="lg" className="w-full" disabled={isPending}>
            {isPending ? "Signing in…" : "Sign In"}
          </GoldButton>
        </form>
      </div>
    </div>
  );
}
