# Co-shareX255

A bill-splitting app: upload a receipt photo, pull line items out with on-device OCR, add the people splitting the bill, assign items equally or by manual percentage, and share a link with everyone's total.

Design reference and full behavior spec: [docs/DESIGN-HANDOFF.md](docs/DESIGN-HANDOFF.md). Original interactive prototype: [docs/prototype-reference.html](docs/prototype-reference.html).

## Stack
- Vite + React + TypeScript
- Tesseract.js for client-side receipt OCR (no server, no API key)
- Supabase (Postgres) for share-link persistence — optional; the app runs fine without it, share links just won't load on other devices until it's connected

## Local development
```bash
npm install
npm run dev
```

## Connecting Supabase (optional, needed for real share links)
1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run [`supabase/schema.sql`](supabase/schema.sql) to create the `bills` table.
3. Copy `.env.example` to `.env` and fill in your project's URL and anon public key (Project Settings → API).
4. Restart `npm run dev`. Without these, "Generate link" on the Summary step falls back to a local-only simulated link, same as the original prototype.

## Build
```bash
npm run build
```
Outputs a static site to `dist/` — deployable to Vercel, Netlify, or any static host. No server-side rendering or rewrites needed; the share-link route (`#/s/<id>`) uses hash routing so no host-specific redirect config is required.

## Deploying to Vercel
1. Push this repo to GitHub.
2. In the Vercel dashboard, "Add New Project" → import the GitHub repo. Framework preset "Vite" is auto-detected.
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as Environment Variables in the Vercel project settings (if using Supabase).
4. Deploy — Vercel gives you an `https://<project>.vercel.app` link automatically, plus redeploys on every push to `main`.
