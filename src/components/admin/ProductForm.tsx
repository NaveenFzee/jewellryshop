"use client";

import { useActionState } from "react";
import GoldButton from "@/components/ui/GoldButton";
import type { ActionResult } from "@/lib/actions";
import type { Category, Product } from "@/lib/types";

const initialState: ActionResult | null = null;

const inputClass =
  "mt-1.5 w-full rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 text-sm focus-visible:outline-champagne";
const labelClass = "text-xs font-label uppercase tracking-wider text-ink/55";

export default function ProductForm({
  action,
  categories,
  product,
}: {
  action: (prev: ActionResult | null, formData: FormData) => Promise<ActionResult>;
  categories: Category[];
  product?: Product;
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-8 max-w-3xl">
      <section className="ivory-card p-6 grid sm:grid-cols-2 gap-5">
        <h2 className="sm:col-span-2 font-display text-lg text-ink">Basic Info</h2>
        <div>
          <label className={labelClass}>SKU *</label>
          <input name="sku" defaultValue={product?.sku} required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Slug * (url-friendly)</label>
          <input name="slug" defaultValue={product?.slug} required pattern="[a-z0-9-]+" className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Product Name *</label>
          <input name="name" defaultValue={product?.name} required className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Description</label>
          <textarea name="description" defaultValue={product?.description ?? ""} rows={3} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Category</label>
          <select name="category_id" defaultValue={product?.category_id ?? ""} className={inputClass}>
            <option value="">— None —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Gender</label>
          <select name="gender" defaultValue={product?.gender ?? ""} className={inputClass}>
            <option value="">— None —</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kids">Kids</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Primary Image URL</label>
          <input
            name="image_url"
            type="url"
            defaultValue={product?.product_images?.find((i) => i.is_primary)?.image_url ?? ""}
            placeholder="https://..."
            className={inputClass}
          />
          <p className="text-[11px] text-ink/40 mt-1">
            Paste an image URL for now — see README &ldquo;Wiring image uploads&rdquo; to add Supabase Storage upload here.
          </p>
        </div>
      </section>

      <section className="ivory-card p-6 grid sm:grid-cols-2 gap-5">
        <h2 className="sm:col-span-2 font-display text-lg text-ink">Metal & Weight</h2>
        <div>
          <label className={labelClass}>Metal Type *</label>
          <select name="metal_type" defaultValue={product?.metal_type ?? "gold"} required className={inputClass}>
            <option value="gold">Gold</option>
            <option value="silver">Silver</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Purity * (e.g. 22K, 92.5)</label>
          <input name="purity" defaultValue={product?.purity} required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Gross Weight (g) *</label>
          <input name="gross_weight" type="number" step="0.001" defaultValue={product?.gross_weight} required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Net Weight (g) *</label>
          <input name="net_weight" type="number" step="0.001" defaultValue={product?.net_weight} required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Stone Weight (g)</label>
          <input name="stone_weight" type="number" step="0.001" defaultValue={product?.stone_weight ?? 0} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Stone Charge (₹)</label>
          <input name="stone_charge" type="number" step="0.01" defaultValue={product?.stone_charge ?? 0} className={inputClass} />
        </div>
      </section>

      <section className="ivory-card p-6 grid sm:grid-cols-2 gap-5">
        <h2 className="sm:col-span-2 font-display text-lg text-ink">Pricing Rules</h2>
        <div>
          <label className={labelClass}>Making Charge Type *</label>
          <select name="making_charge_type" defaultValue={product?.making_charge_type ?? "percentage"} required className={inputClass}>
            <option value="percentage">Percentage of gold value</option>
            <option value="fixed">Fixed amount (₹)</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Making Charge Value *</label>
          <input
            name="making_charge_value"
            type="number"
            step="0.01"
            defaultValue={product?.making_charge_value ?? 0}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>GST % *</label>
          <input name="gst_percentage" type="number" step="0.01" defaultValue={product?.gst_percentage ?? 3} required className={inputClass} />
        </div>
      </section>

      <section className="ivory-card p-6">
        <h2 className="font-display text-lg text-ink mb-4">Flags</h2>
        <div className="flex flex-wrap gap-6">
          {[
            { name: "is_featured", label: "Featured", defaultChecked: product?.is_featured },
            { name: "is_new_arrival", label: "New Arrival", defaultChecked: product?.is_new_arrival },
            { name: "is_bridal", label: "Bridal Collection", defaultChecked: product?.is_bridal },
            { name: "is_active", label: "Active (visible on site)", defaultChecked: product?.is_active ?? true },
          ].map((f) => (
            <label key={f.name} className="flex items-center gap-2 text-sm text-ink/75">
              <input type="checkbox" name={f.name} defaultChecked={f.defaultChecked} className="h-4 w-4 accent-champagne" />
              {f.label}
            </label>
          ))}
        </div>
      </section>

      {state && !state.success && <p className="text-sm text-oxblood">{state.message}</p>}

      <GoldButton type="submit" size="lg" disabled={isPending}>
        {isPending ? "Saving…" : product ? "Save Changes" : "Create Product"}
      </GoldButton>
    </form>
  );
}
