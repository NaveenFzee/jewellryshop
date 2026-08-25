"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-auth";
import type { ActionResult } from "@/lib/actions";
import type { EnquiryStatus } from "@/lib/types";

// ============================================================================
// OFFERS
// ============================================================================

const offerSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  banner_image_url: z.string().url().optional().or(z.literal("")),
  discount_text: z.string().optional(),
  terms_conditions: z.string().optional(),
  valid_from: z.string().min(1, "Start date is required"),
  valid_until: z.string().min(1, "End date is required"),
  is_active: z.coerce.boolean().default(true),
});

export async function createOffer(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const parsed = offerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message ?? "Please check the form." };

  const supabase = await createClient();
  const { error } = await supabase.from("offers").insert(parsed.data);
  if (error) return { success: false, message: "Could not create offer." };

  revalidatePath("/admin/offers");
  revalidatePath("/offers");
  revalidatePath("/");
  return { success: true, message: "Offer created." };
}

export async function toggleOfferActive(id: string, isActive: boolean): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("offers").update({ is_active: isActive }).eq("id", id);
  revalidatePath("/admin/offers");
  revalidatePath("/offers");
  revalidatePath("/");
}

export async function deleteOffer(id: string): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("offers").delete().eq("id", id);
  revalidatePath("/admin/offers");
  revalidatePath("/offers");
}

// ============================================================================
// RATES
// Updating rates does two things: writes the "current" row (gold_rates /
// silver_rates — the table LiveRates and the product pricing read from) and
// upserts today's rate_history row (what the chart reads from). Both must
// happen together or the chart and the live rate silently disagree.
// ============================================================================

const goldRateSchema = z.object({
  rate_24k: z.coerce.number().positive(),
  rate_22k: z.coerce.number().positive(),
  rate_20k: z.coerce.number().positive(),
  rate_18k: z.coerce.number().positive(),
});

export async function updateGoldRate(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const parsed = goldRateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { success: false, message: "Enter valid rates for all four purities." };

  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  const { error: insertError } = await supabase.from("gold_rates").insert({ ...parsed.data, source: "manual" });
  if (insertError) return { success: false, message: "Could not update gold rate." };

  const historyRows = [
    { metal_type: "gold_24k", rate: parsed.data.rate_24k, recorded_date: today },
    { metal_type: "gold_22k", rate: parsed.data.rate_22k, recorded_date: today },
    { metal_type: "gold_20k", rate: parsed.data.rate_20k, recorded_date: today },
    { metal_type: "gold_18k", rate: parsed.data.rate_18k, recorded_date: today },
  ];
  await supabase.from("rate_history").upsert(historyRows, { onConflict: "metal_type,recorded_date" });

  revalidatePath("/admin/rates");
  revalidatePath("/gold-rate");
  revalidatePath("/");
  return { success: true, message: "Gold rate updated." };
}

const silverRateSchema = z.object({ rate: z.coerce.number().positive() });

export async function updateSilverRate(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const parsed = silverRateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { success: false, message: "Enter a valid silver rate." };

  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  const { error: insertError } = await supabase.from("silver_rates").insert({ rate: parsed.data.rate, source: "manual" });
  if (insertError) return { success: false, message: "Could not update silver rate." };

  await supabase
    .from("rate_history")
    .upsert({ metal_type: "silver", rate: parsed.data.rate, recorded_date: today }, { onConflict: "metal_type,recorded_date" });

  revalidatePath("/admin/rates");
  revalidatePath("/gold-rate");
  revalidatePath("/");
  return { success: true, message: "Silver rate updated." };
}

// ============================================================================
// ENQUIRIES
// ============================================================================

export async function updateEnquiryStatus(id: string, status: EnquiryStatus): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("enquiries").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
  revalidatePath("/admin/enquiries");
}

export async function updateCustomRequestStatus(id: string, status: EnquiryStatus): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("custom_jewellery_requests").update({ status }).eq("id", id);
  revalidatePath("/admin/enquiries");
}
