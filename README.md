<<<<<<< HEAD
# [Your Jewellery Shop] — Website

A Next.js 15 + TypeScript + Tailwind + Supabase jewellery storefront with a live gold/silver rate
board, product catalogue, offers, and an admin panel (auth-protected CRUD for products, offers,
rates, and enquiries).

**Read this before you do anything else — it tells you exactly what's real and working versus
what's intentionally left as a next step.** Everything below has been checked for internal
consistency (every import resolves, every 'use client' boundary is in the right place, every
Supabase relation embed matches a real foreign key) — see "How this was verified" at the bottom.
It has **not** been run through `npm install`/`npm run build`, because the environment this was
built in has no network access. Treat the first build as the moment you find out if any package
version needs a bump.

---

## 1. What's fully built

- **Database**: all 15 tables from the spec, indexes, full Row Level Security policies, seed data.
- **Storefront**: home page (hero, live rate board, offers, categories, featured products, new
  arrivals, why-choose-us, services, custom-jewellery form, bridal section, about, testimonials,
  store location), product listing with filters/sort at `/jewellery` and `/jewellery/[gold|silver]`,
  product detail page with the real price calculation, `/gold-rate` with a historical chart,
  `/collections`, `/offers`, `/services`, `/contact`, `/wishlist`, policy pages.
- **Admin panel** (`/admin`, login-protected): dashboard, full Products CRUD, Offers CRUD, Rate
  updates (writes both the live rate and the history point), Enquiries + Custom Requests with
  status management.
- **APIs**: `GET /api/gold-rates` (matches the spec's exact response shape, never fabricates data
  on failure), `GET /api/rate-history`.
- **SEO/PWA**: dynamic sitemap.xml, robots.txt, JSON-LD (LocalBusiness + Product), PWA manifest,
  per-page metadata.

## 2. What's intentionally NOT built — and what to do about each

| Item | Status | Next step |
|---|---|---|
| Image uploads | Admin forms take an **image URL**, not a file upload | See "Wiring image uploads" below |
| Automatic rate provider | Rates are entered manually in `/admin/rates` (this always works) | See "Wiring a live rate provider" below |
| Full-text product search | Filter-based browsing only; no search-bar backend | Add a Postgres `tsvector` column + a `/api/search` route, or use Supabase's built-in text search on `products.name`/`sku` |
| "Popular" sort | Falls back to newest-first — there's no view/click-count column yet | Add a `view_count` or `enquiry_count` column, increment it, sort by it |
| Testimonials | Hardcoded placeholder copy in `components/home/Testimonials.tsx` | Replace with real reviews, or a `reviews` table |
| Multi-image gallery in admin | Product form manages one primary image URL; the schema/gallery UI on the product page supports many | Extend `ProductForm` with a repeatable image-URL list, or build on the Storage upload below |
| PWA icons | `manifest.ts` references `/icon-192.png` and `/icon-512.png` that don't exist yet (only `icon.svg` does) | Drop real PNGs at those paths in `public/` |
| Tests | None | Add Playwright/Vitest as the codebase grows |
| Rate limiting on public forms | None | Add at the Vercel/Supabase edge (e.g. Upstash rate limiting) before launch if spam becomes an issue |

None of this is hidden inside the code without a marker — search the codebase for `README` in
comments to find the exact spots that reference this table.

---

## 3. Local setup

### Prerequisites
- Node.js 18.18+ (Node 20 LTS recommended)
- A free [Supabase](https://supabase.com) account
- npm (or pnpm/yarn — adjust commands accordingly)

### Step 1 — Install dependencies
```bash
cd jewellery-store
npm install
```
If any package has moved past the version pinned in `package.json` and npm complains, run
`npm install <package>@latest` for that one package — don't mass-upgrade everything at once.

### Step 2 — Create a Supabase project
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) → **New Project**.
2. Once it's provisioned, go to **Project Settings → API**. You'll need:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret — never commit it)

### Step 3 — Run the database schema
1. In the Supabase dashboard, open **SQL Editor → New Query**.
2. Paste the entire contents of `supabase/schema.sql` and run it.
3. Confirm in **Table Editor** that all 15 tables now exist, and that `categories`/`services`/
   `gold_rates`/`silver_rates` have the seed rows.

### Step 4 — Configure environment variables
```bash
cp .env.local.example .env.local
```
Fill in the Supabase values from Step 2, plus your shop's name/phone/WhatsApp/address/etc.
Every piece of shop identity is read from these env vars (`src/lib/config.ts`) — nothing is
hardcoded in components.

### Step 5 — Create your first admin user
Signing up a user does **not** make them an admin — inserting a row into `admin_users` does.
Easiest path:
1. Supabase Dashboard → **Authentication → Users → Add User** (set an email + password directly;
   skip the "send invite" flow for your own first account).
2. Copy that user's UUID from the Users table.
3. SQL Editor → run:
   ```sql
   insert into admin_users (id, full_name, role) values ('paste-the-uuid-here', 'Your Name', 'admin');
   ```
4. Now `/admin/login` with that email/password will work.

### Step 6 — Run it
```bash
npm run dev
```
Visit `http://localhost:3000`. Add a category and a product or two via `/admin/products/new` to
see the storefront populate (it renders correctly with zero products too — most sections just
render nothing rather than break).

---

## 4. Wiring image uploads

Right now, product/offer images are just a pasted URL. To accept real file uploads:

1. Supabase Dashboard → **Storage → New Bucket** → name it `product-images`, make it **public**.
2. Add a Storage RLS policy allowing authenticated admins to `INSERT`/`UPDATE`/`DELETE` (mirror the
   `is_admin()` pattern already used everywhere else in `schema.sql`).
3. In `ProductForm.tsx`, replace the `<input type="url" name="image_url">` with a file `<input>`,
   and in `admin-actions-products.ts`, before the `products` insert/update, call
   `supabase.storage.from('product-images').upload(...)` and use the returned public URL in place
   of the current `image_url` form field.

## 5. Wiring a live rate provider

`/admin/rates` is the manual path and always works — treat it as the fallback even after
automating. To automate:

1. Pick a provider (e.g. a metals-price API) and get an API key.
2. Add `GOLD_RATE_PROVIDER_API_KEY` / `GOLD_RATE_PROVIDER_URL` to your env vars (placeholders
   already exist in `.env.local.example`).
3. Create a scheduled job — either a [Vercel Cron Job](https://vercel.com/docs/cron-jobs) hitting
   a new `app/api/cron/update-rates/route.ts`, or a Supabase Edge Function on a schedule — that:
   - Fetches the rate from your provider
   - Performs the same two writes `updateGoldRate`/`updateSilverRate` do in
     `admin-actions-offers-rates.ts` (write the current-rate row **and** upsert today's
     `rate_history` row) — copy that logic rather than duplicating it, or refactor it into a
     shared function both the admin form and the cron route call.
4. Never call a third-party rate API directly from a client component — always go through a
   server route, so the API key stays server-side.

---

## 6. Deploying (Vercel + Supabase)

Supabase is already hosted — you only need to deploy the Next.js app.

1. Push this project to a GitHub repo.
2. [vercel.com/new](https://vercel.com/new) → import the repo.
3. In **Environment Variables**, add everything from your `.env.local` (all `NEXT_PUBLIC_*` vars,
   `SUPABASE_SERVICE_ROLE_KEY`, and your shop identity vars). Set `NEXT_PUBLIC_SITE_URL` to your
   real production domain — it's used in metadata and the sitemap.
4. Deploy. Vercel builds and hosts on its global edge network automatically.
5. Add your custom domain under **Project → Settings → Domains**, then update `NEXT_PUBLIC_SITE_URL`
   to match and redeploy.
6. In Supabase → **Authentication → URL Configuration**, add your production domain to the allowed
   redirect URLs (needed for the admin login flow to work in production).

That's the whole path — no separate backend to host, since Supabase serves as both the database
and the auth provider.

---

## 7. Project structure

```
supabase/schema.sql          All tables, indexes, RLS policies, seed data — run once in Supabase
src/lib/config.ts            All shop identity (name/phone/address/etc.) — edit via env vars, not here
src/lib/pricing.ts           The exact price formula from the spec
src/lib/types.ts             TypeScript types matching the DB schema
src/lib/supabase/            Browser client, server client, service-role client, public client
src/lib/actions.ts           Public-facing server actions (enquiry forms)
src/lib/admin-actions-*.ts   Admin server actions (products / offers+rates+enquiries)
src/lib/admin-auth.ts        requireAdmin() guard used by every admin page
src/middleware.ts            Session refresh + "must be logged in" redirect for /admin/*
src/components/ui/           Design-system primitives (GoldButton, SectionHeading, GlassCard)
src/components/layout/       Header, Footer, floating buttons
src/components/home/         One component per home page section
src/components/product/      Listing, filters, gallery, price breakdown, action bar
src/components/admin/        Sidebar, forms, status controls
src/app/                     Routes (App Router) — see file tree for the full map
```

## 8. Design system reference

Colors, type, and the signature "Live Rate Board" pattern are all defined in
`tailwind.config.ts` and `src/app/globals.css`. If you rebrand, change the five named colors in
`tailwind.config.ts` (`ink`, `champagne`, `ivory`, `oxblood`, `platinum`) rather than editing
individual components — everything references the tokens, not hex values directly (except a couple
of one-off gradient/shadow values called out with comments where they appear).

## 9. How this was verified

Since this environment has no network access, `npm install` / `next build` / `tsc` could not be
run against real dependencies. Instead, every file was checked with static analysis before
delivery:
- Every `@/...` import across all 74 source files resolves to a real file.
- Every file calling a React hook (`useState`, `useEffect`, `useActionState`, etc.) has the
  `"use client"` directive.
- Every default/named import has a matching export in its target file.
- Every Supabase `.select("*, relation(...)")` embed matches an actual foreign key in `schema.sql`.

This catches the most common "silent breakage" categories in a multi-file AI-generated codebase,
but it is **not** a substitute for actually running the build. Run `npm run build` yourself before
deploying, and treat the first error you see as completely normal for a project this size — fix
forward from there.
=======
# jewellryshop
New jewellry shop website
>>>>>>> 10ef497a198ac6a92a077b7f11da4b71e69e352b
