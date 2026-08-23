# FS Archives

A luxury e-commerce storefront for bags, jewelry, and accessories. React + Vite frontend with an Express API backend, backed by Supabase (Postgres + Storage).

## Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, Wouter (routing), TanStack Query, Framer Motion
- **Backend**: Express 5, running on port 3001 in dev
- **Database & Storage**: Supabase (Postgres tables + `product-images` storage bucket)
- **Auth**: JWT-based admin auth (password stored as bcrypt hash in `admin_settings` Supabase table)

## Running the app

```
npm run dev
```

Runs both the Vite dev server (port 5000) and the Express API (port 3001) via `concurrently`. Vite proxies `/api` requests to port 3001.

## Admin access

Visit `/admin` — the password hash is stored in Supabase (`admin_settings` table, key `admin_password_hash`). To reset the password, delete that row and visit `/admin/setup`.

## Seeding data

```
npm run db:seed
```

Seeds products, categories, and featured products from `data/*.json` into Supabase.

## Key directories

- `src/` — Vite React app entry point and all frontend code
- `src/pages/` — Route-level pages (HomePage, CatalogPage, AdminPages)
- `src/components/` — Shared UI components
- `server/` — Express API (index.ts is the single server file)
- `data/` — Static JSON seed data

## Environment variables

Set via Replit Secrets/Env Vars. The server reads them via `dotenv/config`:

| Key | Description |
|-----|-------------|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (secret) |
| `JWT_SECRET` | Secret for signing admin JWTs |
| `CORS_ORIGIN` | Comma-separated allowed origins |
| `SUPABASE_STORAGE_BUCKET` | Storage bucket name (default: `product-images`) |
| `VITE_WHATSAPP_NUMBER` | WhatsApp number for contact links |
| `ADMIN_PASSWORD` | Plain-text password used by `npm run db:seed` to hash and store admin credentials in Supabase |

## Initial setup (first run)

1. Add all secrets above via Replit Secrets.
2. Apply the schema to your Supabase project by running the SQL in `supabase/migrations/0001_initial_schema.sql` in the Supabase SQL editor.
3. Run `npm run db:seed` — this seeds products, categories, and the admin password hash (idempotent).
4. Visit `/admin` and sign in with the password from `ADMIN_PASSWORD`.

## User preferences

- Keep the existing project structure; do not migrate to a different stack.
