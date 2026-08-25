import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Call at the top of any admin Server Component or Server Action that
 * touches admin-only data. Redirects to /admin/login if not authenticated,
 * and to /admin/login?error=not_admin if authenticated but not present in
 * admin_users (middleware.ts only checks "is logged in", not "is admin" —
 * this is the actual admin check).
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: adminRow } = await supabase.from("admin_users").select("id, full_name, role").eq("id", user.id).maybeSingle();

  if (!adminRow) redirect("/admin/login?error=not_admin");

  return { user, admin: adminRow };
}
