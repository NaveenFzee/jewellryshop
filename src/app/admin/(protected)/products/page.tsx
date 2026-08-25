import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { toggleProductActive, deleteProduct } from "@/lib/admin-actions-products";
import type { Product } from "@/lib/types";

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*, product_images(*), categories(name)")
    .order("created_at", { ascending: false });

  const list = (products ?? []) as Product[];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl text-ink">Products ({list.length})</h1>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-ink text-champagne text-sm font-label uppercase tracking-wider px-5 py-2.5 rounded-full hover:bg-ink/85"
        >
          <Plus size={15} /> Add Product
        </Link>
      </div>

      <div className="ivory-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ink/5 text-left">
            <tr>
              <th className="p-4 font-label text-xs uppercase tracking-wider text-ink/50">Product</th>
              <th className="p-4 font-label text-xs uppercase tracking-wider text-ink/50">SKU</th>
              <th className="p-4 font-label text-xs uppercase tracking-wider text-ink/50">Category</th>
              <th className="p-4 font-label text-xs uppercase tracking-wider text-ink/50">Metal</th>
              <th className="p-4 font-label text-xs uppercase tracking-wider text-ink/50">Status</th>
              <th className="p-4 font-label text-xs uppercase tracking-wider text-ink/50">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id} className="border-t border-ink/10">
                <td className="p-4 flex items-center gap-3">
                  <div className="relative h-10 w-10 rounded-md overflow-hidden bg-ink/5 shrink-0">
                    {p.product_images?.[0]?.image_url && (
                      <Image src={p.product_images[0].image_url} alt="" fill className="object-cover" sizes="40px" />
                    )}
                  </div>
                  <span className="text-ink font-medium">{p.name}</span>
                </td>
                <td className="p-4 text-ink/60">{p.sku}</td>
                <td className="p-4 text-ink/60">{p.categories?.name ?? "—"}</td>
                <td className="p-4 text-ink/60 capitalize">
                  {p.metal_type} · {p.purity}
                </td>
                <td className="p-4">
                  <form
                    action={async () => {
                      "use server";
                      await toggleProductActive(p.id, !p.is_active);
                    }}
                  >
                    <button
                      type="submit"
                      className={`text-xs px-2.5 py-1 rounded-full ${
                        p.is_active ? "bg-emerald-100 text-emerald-700" : "bg-ink/10 text-ink/50"
                      }`}
                    >
                      {p.is_active ? "Active" : "Inactive"}
                    </button>
                  </form>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <Link href={`/admin/products/${p.id}/edit`} className="text-ink/60 hover:text-champagne-dark">
                      <Pencil size={15} />
                    </Link>
                    <form
                      action={async () => {
                        "use server";
                        await deleteProduct(p.id);
                      }}
                    >
                      <button type="submit" className="text-xs text-oxblood hover:underline">
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && <p className="p-8 text-center text-ink/50">No products yet — add your first one.</p>}
      </div>
    </div>
  );
}
