"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const customRequestSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  phone: z.string().min(8, "Please enter a valid phone number"),
  whatsapp: z.string().optional(),
  jewelleryType: z.string().optional(),
  requirement: z.string().optional(),
  budgetRange: z.string().optional(),
});

export interface ActionResult {
  success: boolean;
  message: string;
}

export async function submitCustomJewelleryRequest(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const parsed = customRequestSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    whatsapp: formData.get("whatsapp") || undefined,
    jewelleryType: formData.get("jewelleryType") || undefined,
    requirement: formData.get("requirement") || undefined,
    budgetRange: formData.get("budgetRange") || undefined,
  });

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Please check the form and try again." };
  }

  const supabase = await createClient();
  // NOTE: reference_image_url upload isn't wired here — see README
  // "Wiring image uploads" for adding Supabase Storage upload before insert.
  const { error } = await supabase.from("custom_jewellery_requests").insert({
    name: parsed.data.name,
    phone: parsed.data.phone,
    whatsapp: parsed.data.whatsapp || null,
    jewellery_type: parsed.data.jewelleryType || null,
    requirement: parsed.data.requirement || null,
    budget_range: parsed.data.budgetRange || null,
  });

  if (error) {
    return { success: false, message: "Something went wrong submitting your request. Please try again or WhatsApp us directly." };
  }

  return { success: true, message: "Thank you! Our team will reach out to you shortly." };
}

const enquirySchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  phone: z.string().min(8, "Please enter a valid phone number"),
  message: z.string().optional(),
  productId: z.string().uuid().optional(),
});

export async function submitEnquiry(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = enquirySchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    message: formData.get("message") || undefined,
    productId: formData.get("productId") || undefined,
  });

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Please check the form and try again." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("enquiries").insert({
    name: parsed.data.name,
    phone: parsed.data.phone,
    message: parsed.data.message || null,
    product_id: parsed.data.productId || null,
  });

  if (error) {
    return { success: false, message: "Something went wrong. Please try again or WhatsApp us directly." };
  }

  return { success: true, message: "Thank you! We'll get back to you shortly." };
}
