import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProductForm from "@/components/admin/ProductForm";
import { updateProduct } from "@/lib/admin-actions-products";
import type { Category, Product } from "@/lib/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from("products").select("*, product_images(*)").eq("id", id).maybeSingle(),
    supabase.from("categories").select("*").eq("is_active", true).order("display_order"),
  ]);

  if (!product) notFound();

  const boundUpdate = updateProduct.bind(null, id);

  return (
    <div>
      <h1 className="font-display text-3xl text-ink mb-8">Edit Product</h1>
      <ProductForm action={boundUpdate} categories={(categories ?? []) as Category[]} product={product as Product} />
    </div>
  );
}
