import { createClient } from "@/lib/supabase/server";
import StatusSelect from "@/components/admin/StatusSelect";
import type { Enquiry, CustomJewelleryRequest } from "@/lib/types";

export default async function AdminEnquiriesPage() {
  const supabase = await createClient();
  const [{ data: enquiries }, { data: customRequests }] = await Promise.all([
    supabase.from("enquiries").select("*, products(name)").order("created_at", { ascending: false }).limit(50),
    supabase.from("custom_jewellery_requests").select("*").order("created_at", { ascending: false }).limit(50),
  ]);

  return (
    <div className="space-y-12">
      <div>
        <h1 className="font-display text-3xl text-ink mb-6">Enquiries</h1>
        <div className="ivory-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-ink/5 text-left">
              <tr>
                <th className="p-4 font-label text-xs uppercase tracking-wider text-ink/50">Name</th>
                <th className="p-4 font-label text-xs uppercase tracking-wider text-ink/50">Phone</th>
                <th className="p-4 font-label text-xs uppercase tracking-wider text-ink/50">Product</th>
                <th className="p-4 font-label text-xs uppercase tracking-wider text-ink/50">Message</th>
                <th className="p-4 font-label text-xs uppercase tracking-wider text-ink/50">Date</th>
                <th className="p-4 font-label text-xs uppercase tracking-wider text-ink/50">Status</th>
              </tr>
            </thead>
            <tbody>
              {((enquiries ?? []) as (Enquiry & { products: { name: string } | null })[]).map((e) => (
                <tr key={e.id} className="border-t border-ink/10 align-top">
                  <td className="p-4 text-ink font-medium">{e.name}</td>
                  <td className="p-4 text-ink/60">{e.phone}</td>
                  <td className="p-4 text-ink/60">{e.products?.name ?? "—"}</td>
                  <td className="p-4 text-ink/60 max-w-xs truncate">{e.message ?? "—"}</td>
                  <td className="p-4 text-ink/50 text-xs whitespace-nowrap">
                    {new Date(e.created_at).toLocaleDateString("en-IN")}
                  </td>
                  <td className="p-4">
                    <StatusSelect id={e.id} status={e.status} kind="enquiry" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!enquiries || enquiries.length === 0) && <p className="p-8 text-center text-ink/50">No enquiries yet.</p>}
        </div>
      </div>

      <div>
        <h2 className="font-display text-3xl text-ink mb-6">Custom Jewellery Requests</h2>
        <div className="ivory-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-ink/5 text-left">
              <tr>
                <th className="p-4 font-label text-xs uppercase tracking-wider text-ink/50">Name</th>
                <th className="p-4 font-label text-xs uppercase tracking-wider text-ink/50">Phone</th>
                <th className="p-4 font-label text-xs uppercase tracking-wider text-ink/50">Type</th>
                <th className="p-4 font-label text-xs uppercase tracking-wider text-ink/50">Budget</th>
                <th className="p-4 font-label text-xs uppercase tracking-wider text-ink/50">Requirement</th>
                <th className="p-4 font-label text-xs uppercase tracking-wider text-ink/50">Status</th>
              </tr>
            </thead>
            <tbody>
              {((customRequests ?? []) as CustomJewelleryRequest[]).map((r) => (
                <tr key={r.id} className="border-t border-ink/10 align-top">
                  <td className="p-4 text-ink font-medium">{r.name}</td>
                  <td className="p-4 text-ink/60">{r.phone}</td>
                  <td className="p-4 text-ink/60">{r.jewellery_type ?? "—"}</td>
                  <td className="p-4 text-ink/60">{r.budget_range ?? "—"}</td>
                  <td className="p-4 text-ink/60 max-w-xs truncate">{r.requirement ?? "—"}</td>
                  <td className="p-4">
                    <StatusSelect id={r.id} status={r.status} kind="custom_request" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!customRequests || customRequests.length === 0) && (
            <p className="p-8 text-center text-ink/50">No custom requests yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
