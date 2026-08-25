import AdminSidebar from "@/components/admin/AdminSidebar";
import { requireAdmin } from "@/lib/admin-auth";

// This layout wraps every /admin/* route EXCEPT /admin/login (Next.js route
// groups would normally separate these, but a simple pathname check inside
// requireAdmin's caller is enough here since login has its own minimal UI
// and doesn't import this layout's sidebar).
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { admin } = await requireAdmin();

  return (
    <div className="flex">
      <AdminSidebar adminName={admin.full_name ?? "Admin"} />
      <main className="flex-1 bg-ivory min-h-screen p-8">{children}</main>
    </div>
  );
}
