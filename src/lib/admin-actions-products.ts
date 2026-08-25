"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-auth";
import type { ActionResult } from "@/lib/actions";

// ============================================================================
// AUTH
// ============================================================================

export async function signInAdmin(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!email || !password) return { success: false, message: "Enter your email and password." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return { success: false, message: "Invalid email or password." };
  }

  const { data: adminRow } = await supabase.from("admin_users").select("id").eq("id", data.user.id).maybeSingle();
  if (!adminRow) {
    await supabase.auth.signOut();
    return { success: false, message: "This account is not authorized for admin access." };
  }

  redirect("/admin");
}

export async function signOutAdmin() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ============================================================================
// PRODUCTS — the reference CRUD module. Offers/rates follow the same shape:
// requireAdmin() -> validate with zod -> write via the server client (RLS
// allows it because is_admin() passes) -> revalidatePath -> redirect/return.
// ============================================================================

const productSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens"),
  description: z.string().optional(),
  category_id: z.string().uuid().optional().or(z.literal("")),
  metal_type: z.enum(["gold", "silver"]),
  purity: z.string().min(1),
  gross_weight: z.coerce.number().min(0),
  net_weight: z.coerce.number().min(0),
  stone_weight: z.coerce.number().min(0).default(0),
  stone_charge: z.coerce.number().min(0).default(0),
  making_charge_type: z.enum(["percentage", "fixed"]),
  making_charge_value: z.coerce.number().min(0),
  gst_percentage: z.coerce.number().min(0),
  gender: z.enum(["men", "women", "kids", "unisex"]).optional().or(z.literal("")),
  is_featured: z.coerce.boolean().default(false),
  is_new_arrival: z.coerce.boolean().default(false),
  is_bridal: z.coerce.boolean().default(false),
  is_active: z.coerce.boolean().default(true),
  image_url: z.string().url().optional().or(z.literal("")),
});

export async function createProduct(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const parsed = productSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  const supabase = await createClient();
  const { image_url, category_id, gender, ...rest } = parsed.data;

  const { data: product, error } = await supabase
    .from("products")
    .insert({
      ...rest,
      category_id: category_id || null,
      gender: gender || null,
    })
    .select("id")
    .single();

  if (error) {
    return { success: false, message: error.code === "23505" ? "SKU or slug already exists." : "Could not create product." };
  }

  if (image_url) {
    await supabase.from("product_images").insert({ product_id: product.id, image_url, is_primary: true, display_order: 0 });
  }

  revalidatePath("/admin/products");
  revalidatePath("/jewellery");
  redirect("/admin/products");
}

export async function updateProduct(id: string, _prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const parsed = productSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  const supabase = await createClient();
  const { image_url, category_id, gender, ...rest } = parsed.data;

  const { error } = await supabase
    .from("products")
    .update({ ...rest, category_id: category_id || null, gender: gender || null, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return { success: false, message: "Could not update product." };
  }

  if (image_url) {
    // Replace the primary image with the newly provided URL (simple v1 —
    // see README "Wiring image uploads" for real multi-image management).
    await supabase.from("product_images").delete().eq("product_id", id).eq("is_primary", true);
    await supabase.from("product_images").insert({ product_id: id, image_url, is_primary: true, display_order: 0 });
  }

  revalidatePath("/admin/products");
  revalidatePath(`/products`);
  redirect("/admin/products");
}

export async function toggleProductActive(id: string, isActive: boolean): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("products").update({ is_active: isActive }).eq("id", id);
  revalidatePath("/admin/products");
  revalidatePath("/jewellery");
}

export async function deleteProduct(id: string): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("products").delete().eq("id", id);
  revalidatePath("/admin/products");
  revalidatePath("/jewellery");
}
