import { createClient } from "@/lib/supabase/server";
import ProductForm from "@/components/admin/ProductForm";
import { createProduct } from "@/lib/admin-actions-products";
import type { Category } from "@/lib/types";

export default async function NewProductPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from("categories").select("*").eq("is_active", true).order("display_order");

  return (
    <div>
      <h1 className="font-display text-3xl text-ink mb-8">Add Product</h1>
      <ProductForm action={createProduct} categories={(categories ?? []) as Category[]} />
    </div>
  );
}
