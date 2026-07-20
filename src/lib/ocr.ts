import { createWorker, PSM } from 'tesseract.js';
import { preprocessReceiptImage } from './imagePreprocess';

export interface OcrLineItem {
  name: string;
  price: number;
  qty: number;
}

const SKIP_KEYWORDS = [
  'subtotal', 'sub total', 'total', 'tax', 'tip', 'gratuity', 'change',
  'cash', 'card', 'visa', 'mastercard', 'amex', 'balance', 'due',
  'discount', 'service charge', 'server', 'table', 'guest', 'thank',
  // Thai receipts: total/subtotal/grand-total/qty-total lines (all contain รวม),
  // VAT/tax (ภาษี), discount (ส่วนลด), shipping/service fees, cash/change,
  // and order-number metadata (สั่งครั้งที่).
  'รวม', 'ภาษี', 'ส่วนลด', 'หัก', 'ค่าขนส่ง', 'ค่าบริการ',
  'เงินสด', 'เงินทอน', 'รับเงิน', 'บัตร', 'ครั้งที่',
];

// Matches a line ending in a price like "Pad Thai 120.00", "Iced Tea ฿30.00",
// or "4 Pillars shiraz 1,260.00" (thousands separator).
const LINE_RE = /^(.+?)\s+[$฿]?(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?)\s*$/;

export function parseReceiptText(text: string): OcrLineItem[] {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const items: OcrLineItem[] = [];

  for (const line of lines) {
    const lower = line.toLowerCase();
    if (SKIP_KEYWORDS.some((kw) => lower.includes(kw))) continue;

    const match = line.match(LINE_RE);
    if (!match) continue;

    const price = Number(match[2].replace(/,/g, ''));
    if (!Number.isFinite(price) || price <= 0 || price > 100000) continue;

    // Extract a leading qty like "2x Iced Tea" or "50 เมล็ดกาแฟคั่วเข้ม" BEFORE
    // stripping leading digits/punctuation, or the qty digits get discarded first.
    let name = match[1].trim();
    let qty = 1;
    const qtyMatch = name.match(/^(\d+)\s*[xX]?\s+(.+)$/);
    if (qtyMatch) {
      const parsedQty = Number(qtyMatch[1]);
      if (parsedQty > 0 && parsedQty <= 999) {
        qty = parsedQty;
        name = qtyMatch[2].trim();
      }
    }
    name = name.replace(/^[-*•.\s]+/, '').trim();

    if (!name || name.length < 2) continue;
    items.push({ name, price, qty });
  }

  return items.slice(0, 30);
}

export async function extractReceiptItems(file: File): Promise<OcrLineItem[]> {
  const processed = await preprocessReceiptImage(file);
  // Thai receipts mix Thai script item names with Arabic-numeral prices —
  // 'eng' alone can't recognize Thai characters at all, so load both.
  const worker = await createWorker(['eng', 'tha']);
  try {
    // Receipts are effectively one column of text — telling Tesseract to
    // treat the page as a single uniform block avoids it trying (and
    // failing) to detect multi-column layout on a narrow strip of paper.
    await worker.setParameters({ tessedit_pageseg_mode: PSM.SINGLE_BLOCK });
    const { data } = await worker.recognize(processed);
    return parseReceiptText(data.text);
  } finally {
    await worker.terminate();
  }
}
