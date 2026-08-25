import { createClient } from "@/lib/supabase/server";
import { createOffer, toggleOfferActive, deleteOffer } from "@/lib/admin-actions-offers-rates";
import OfferForm from "@/components/admin/OfferForm";
import type { Offer } from "@/lib/types";

export default async function AdminOffersPage() {
  const supabase = await createClient();
  const { data: offers } = await supabase.from("offers").select("*").order("valid_until", { ascending: false });
  const list = (offers ?? []) as Offer[];

  return (
    <div>
      <h1 className="font-display text-3xl text-ink mb-8">Offers</h1>

      <div className="grid lg:grid-cols-[1fr_380px] gap-8">
        <div className="ivory-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-ink/5 text-left">
              <tr>
                <th className="p-4 font-label text-xs uppercase tracking-wider text-ink/50">Title</th>
                <th className="p-4 font-label text-xs uppercase tracking-wider text-ink/50">Valid</th>
                <th className="p-4 font-label text-xs uppercase tracking-wider text-ink/50">Status</th>
                <th className="p-4 font-label text-xs uppercase tracking-wider text-ink/50">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((o) => (
                <tr key={o.id} className="border-t border-ink/10">
                  <td className="p-4 text-ink font-medium">{o.title}</td>
                  <td className="p-4 text-ink/60 text-xs">
                    {new Date(o.valid_from).toLocaleDateString("en-IN")} – {new Date(o.valid_until).toLocaleDateString("en-IN")}
                  </td>
                  <td className="p-4">
                    <form
                      action={async () => {
                        "use server";
                        await toggleOfferActive(o.id, !o.is_active);
                      }}
                    >
                      <button
                        type="submit"
                        className={`text-xs px-2.5 py-1 rounded-full ${o.is_active ? "bg-emerald-100 text-emerald-700" : "bg-ink/10 text-ink/50"}`}
                      >
                        {o.is_active ? "Active" : "Inactive"}
                      </button>
                    </form>
                  </td>
                  <td className="p-4">
                    <form
                      action={async () => {
                        "use server";
                        await deleteOffer(o.id);
                      }}
                    >
                      <button type="submit" className="text-xs text-oxblood hover:underline">
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && <p className="p-8 text-center text-ink/50">No offers yet — create your first one.</p>}
        </div>

        <div className="ivory-card p-6 h-fit">
          <h2 className="font-display text-lg text-ink mb-4">New Offer</h2>
          <OfferForm action={createOffer} />
        </div>
      </div>
    </div>
  );
}
