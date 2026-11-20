# Handoff: Co-shareX255 — Bill Splitting App

## Overview
A mobile/desktop-responsive bill-splitting tool. A host uploads a photo of a receipt, adds the people splitting the bill, edits/confirms line items, assigns each item to one or more people (equal split or manual % split), then gets a per-person total and a shareable link.

## About the Design Files
The file in this bundle (`Bill Splitting App.dc.html`) is a **design reference built in HTML** — a working interactive prototype showing intended look, layout, and behavior, not production code to copy directly. The task is to **recreate this design in the target codebase's existing environment** (React, Vue, native mobile, etc.), using its established component patterns, state management, and libraries. If no environment/stack exists yet for this feature, choose the most appropriate framework and implement the design there.

## Fidelity
**High-fidelity.** Colors, typography, spacing, and interaction behavior (add/remove people, upload photo, edit items, assign splits, compute totals) are final/intended — recreate pixel-close using the codebase's existing component libraries, adapting only where its component set differs.

## Screens / Views
The app is a single 3-step wizard (Items → Assign → Summary). All steps share:
- Page background `#efece0`, content padding `36px 6vw 80px`.
- Header row: logo mark (small 30×30 rounded-square swatch, `#dd8a3a` fill, 2px `#1c1c1a` border, bisected by a dashed vertical line) + wordmark "Co-shareX255" (Archivo Black, 16px) on the left; "STEP X OF 3" (IBM Plex Mono, 12px, `#8b8370`, letter-spacing 0.06em) on the right.
- Hero: centered H1 "SPLIT THE BILL" (Archivo Black, clamp(32px,5vw,56px), letter-spacing -0.01em) + a subtitle line (16px, `#5c5647`) that changes per step.
- Meta pill bar: centered pill, border `1.5px solid #1c1c1a`, bg `#e7e2cd`, radius 22px, padding `8px 18px`, containing a 7px teal (`#2f7d6e`) dot + mono 12px text: "{n} PEOPLE | {n} ITEMS | SUBTOTAL {$amount}", segments divided by `|` in `#c8bfa0`.
- Step tabs: 3 pill/box tabs in a row, each `1.5px solid #1c1c1a` border, radius 7px, padding `10px 16px`, min-width 120px. Active tab: bg `#f3dcae`, border color `#dd8a3a`. Inactive: bg `#efece0`. Each tab shows a bold mono label ("1 ITEMS" etc, 13px) + a muted 11px sub-label ("items + receipt", "people + split", "who owes what").
- Bottom nav: "← Back" ghost button (white bg, `1.5px solid #1c1c1a`, radius 6px, padding `12px 22px`, disabled/30% opacity on step 1) and a solid "Assign people / Review summary / Start over" button (bg `#1c1c1a`, text `#efece0`, same radius/padding, 14px 600-weight).

### Step 1 — Items (landing page)
- Layout: single full-width column — items table, then receipt upload below it, `gap:16px`.
- **Items table**: white card, `1.5px solid #1c1c1a` border, radius 8px. Header row (grid `1fr 90px 60px 90px 32px`) bg `#e7e2cd`, mono 11px muted labels ITEM/PRICE/QTY/TOTAL. Each item row: editable name (plain text input, transparent bg), price + qty number inputs (bordered, mono 13px), computed line total (mono 13px), and a ✕ remove icon. "Add item manually" button below: full-width, orange `#dd8a3a` fill, `2px solid #1c1c1a` border, radius 8px, 3px hard ink shadow, Archivo Black 15px with an ink circle "+" icon; click appends a blank item. When there are no items, a muted "No items yet" hint sits above it. Below it, a smaller dashed red pill "− Add discount (negative price)" appends a row named "Discount" with its price box focused. Discounts are just items with a negative price (shown in red `#b3382c`); price boxes accept a typed "-". Footer block: Subtotal (positive items) / Discounts (sum of negative items, shown only when present) (mono 13px, muted) then Total (16px bold, teal `#2f7d6e`).
- **Receipt upload** (directly under the items table): dashed `2px #1c1c1a` box, bg `#e7e2cd`, radius 8px, padding 16px. Full-width ink button "Upload your receipt" (bg `#1c1c1a`, text `#efece0`, Archivo Black 15px, camera icon, 3px hard teal shadow). After a photo is picked: 64px thumbnail to its left, label becomes "Upload a different receipt", and a status line reports how many items were added (or that none could be read).
- Behavior: OCR runs on every upload. Scanned items are added above any manually typed items; a new scan replaces the items from the previous scan but never removes manual ones. The photo is optional — the user can add everything by hand.


### Step 2 — Assign
- **Guide strip** (top, full width): white card, `1.5px solid #1c1c1a`, radius 8px, three columns (one column on phones), each an orange numbered circle (`#dd8a3a`, ink border) + bold 14px title + 12px muted hint: 1 "Select an item to split", 2 "Choose who pays for it", 3 "Split equally or by manual %". Matching numbered circles label the Items list (1), the person chips "WHO PAYS FOR THIS ITEM?" (2) and the split buttons "HOW TO SPLIT IT?" (3).
- Layout: left 280px column with the People panel on top and the item-selector list below it (same card chrome, orange top border), + flexible white detail card on the right (border `1.5px solid #1c1c1a`, radius 8px, padding 22px). On phones it stacks: people → items → detail.
- **People panel**: card bg `#e7e2cd`, `1.5px solid #1c1c1a` border, 4px `#dd8a3a` top border, radius 8px, padding 20px. Contains: mono label "PEOPLE" (12px, `#8b8370`, letter-spacing 0.08em), helper line "Who's splitting this bill?" (13px, `#5c5647`), wrapped chip row of people (white bg, `1.5px solid #1c1c1a` border, radius 18px, padding `4px 6px 4px 12px`, name + circular ✕ remove button — `#1c1c1a` bg, `#efece0` text, 16px dia), and an add-row: text input (border `1.5px solid #1c1c1a`, radius 6px, padding `8px 10px`) + square "+" button (`#1c1c1a` bg). Enter key or "+" adds a person; ✕ removes one (also removes them from every item's assignment).
- Selector rows: name + mono price, active row highlighted `#f3dcae` bg, radius 6px.
- Detail card: item name (18px bold) + price (mono, muted) header row; a wrapped row of person chips (pill, `1.5px solid #1c1c1a`, toggle bg `#f3dcae` when included) — click toggles that person's inclusion on this item; a 2-button mode switcher "Split equally" / "Manual %" (active = solid `#1c1c1a` bg / `#efece0` text, inactive = white).
  - **Equal mode**: helper line "Split evenly across {n} people — {$amount} each."
  - **Manual mode**: one row per included person — name (60px) + range slider (0–100, accent `#dd8a3a`) + live percent readout (mono, right-aligned) — plus a running "Total assigned: {n}%" line colored teal `#2f7d6e` when it sums to 100%, orange `#dd8a3a` otherwise (informational only, does not block navigation).

### Step 3 — Summary
- Person total cards: responsive grid (`auto-fit, minmax(200px,1fr)`, gap 16px). Each card: bg `#e7e2cd`, `1.5px solid #1c1c1a` border, 4px top border alternating orange/teal per person index, radius 8px, padding 18px. Contains mono 11px uppercase name + big total (Archivo Black 30px, colored to match the card's accent).
- Share card below: white, bordered, radius 8px, padding 22px. Mono label "SHARE THIS BILL", a read-only text field showing a generated fake share link (`https://splitr.app/s/...`), and a "Copy link" button (solid `#1c1c1a`) that flips to "Copied!" for 1.5s on click (no real clipboard/network wiring — simulate this behavior with `navigator.clipboard` or equivalent in the real implementation).
- "Start over" on this step's Continue button resets all state back to step 1 with 2 default people.

## Interactions & Behavior
- Step tabs are freely clickable at any time (non-linear navigation) in this prototype; consider whether the production app should gate later steps until prerequisites are met (e.g. require ≥1 person before Assign).
- Per-person totals are computed live: each item's price × qty is split among included people (equal or by manual %), discount rows are split the same way as any other item.
- No backend/network calls exist in the prototype — the OCR "extraction" is hardcoded fake data, and the share link is a client-generated string. These need real implementations (actual OCR/vision call, real short-link generation + backend persistence, real people/session accounts if desired).
- No persistence — refreshing the page resets all state. Production should persist to a backend so a shared link actually loads the same bill for other participants.

## State Management
Key state to replicate:
- `step` (0–2, current wizard step)
- `people`: list of `{id, name}`
- `photoUrl`: uploaded receipt image (object URL in prototype → real upload/storage URL in production)
- `items`: list of `{id, name, price, qty}`
- `assignments`: map of `itemId → {mode: 'equal'|'manual', included: personId[], percents: {personId: number}}`
- `activeItemId`: which item is selected on the Assign step
- Derived/computed (not stored): subtotal, grand total, per-person subtotal and total

## Design Tokens
**Colors**
- Background: `#efece0`
- Panel/card background: `#e7e2cd`
- White surface: `#ffffff`
- Ink / primary text / borders: `#1c1c1a`
- Muted text: `#8b8370`, `#5c5647`
- Border muted (dashed dividers): `#d3cbae`, `#c8bfa0`
- Orange accent: `#dd8a3a`
- Orange light (selected/highlight bg): `#f3dcae`
- Teal accent: `#2f7d6e`

**Typography**
- Headline: Archivo Black
- Body / UI: Archivo (400/500/600/700)
- Numbers / labels / mono UI: IBM Plex Mono (400/500/600/700)
- Google Fonts: `Archivo:wght@400;500;600;700`, `Archivo Black`, `IBM Plex Mono:wght@400;500;600;700`

**Radius**: 6px (buttons/inputs), 7px (tabs), 8px (cards), 18px+ (chips/pills)
**Borders**: mostly `1.5px solid #1c1c1a`; accent top-borders are `4px solid` orange or teal; dashed borders are `2px dashed #1c1c1a` (upload dropzone) or `1px dashed #d3cbae` (table row dividers)

## Assets
No image assets — the logo is a CSS-only mark (bordered square + dashed divider). The receipt photo is user-uploaded at runtime (no placeholder asset needed).

## Files
- `Bill Splitting App.dc.html` — the full interactive prototype (single file, inline styles, self-contained state/logic).
