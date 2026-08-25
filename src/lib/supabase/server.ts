import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseJsClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

/**
 * Server-side Supabase client for use in Server Components, Route Handlers,
 * and Server Actions. Next.js 15: cookies() is async, so this function is
 * async too — always `await createClient()`.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component during render — safe to ignore
            // because middleware.ts refreshes the session on every request.
          }
        },
      },
    }
  );
}

/**
 * Admin-only client using the service-role key, which bypasses RLS entirely.
 * NEVER import this into anything that ships to the browser. Only use inside
 * server-only code that has already verified the caller is an authenticated
 * admin (requireAdmin()) — e.g. one-off scripts, or admin operations RLS
 * can't easily express.
 */
export function createServiceRoleClient() {
  return createSupabaseJsClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

/**
 * Plain anon-key client with no cookie handling — for contexts that have no
 * request/cookie scope to read from, like sitemap.ts/robots.ts generation.
 * Only ever reads public, RLS-permitted data (active products, categories,
 * etc.) — never use this where an authenticated/admin view is needed.
 */
export function createPublicClient() {
  return createSupabaseJsClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}
