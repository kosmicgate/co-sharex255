# Co-shareX255

A bill-splitting app: upload a receipt photo, pull line items out with on-device OCR (English + Thai), add the people splitting the bill, assign items equally or by manual percentage, and see an itemized breakdown of what each person owes.

Design reference and full behavior spec: [docs/DESIGN-HANDOFF.md](docs/DESIGN-HANDOFF.md). Original interactive prototype: [docs/prototype-reference.html](docs/prototype-reference.html).

## Stack
- Vite + React + TypeScript
- Tesseract.js for client-side receipt OCR (no server, no API key)

## Local development
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```
Outputs a static site to `dist/` — deployable to Vercel, Netlify, or any static host. No backend or server-side rendering needed.

## Deploying to Vercel
1. Push this repo to GitHub.
2. In the Vercel dashboard, "Add New Project" → import the GitHub repo. Framework preset "Vite" is auto-detected.
3. Deploy — Vercel gives you an `https://<project>.vercel.app` link automatically, plus redeploys on every push to `main`.
