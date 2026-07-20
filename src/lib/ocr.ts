import { createWorker } from 'tesseract.js';

export interface OcrLineItem {
  name: string;
  price: number;
  qty: number;
}

const SKIP_KEYWORDS = [
  'subtotal', 'sub total', 'total', 'tax', 'tip', 'gratuity', 'change',
  'cash', 'card', 'visa', 'mastercard', 'amex', 'balance', 'due',
  'discount', 'service charge', 'server', 'table', 'guest', 'thank',
];

// Matches a line ending in a price like "Pad Thai 12.00" or "Iced Tea $3.00"
const LINE_RE = /^(.+?)\s+\$?(\d+(?:\.\d{1,2})?)\s*$/;

export function parseReceiptText(text: string): OcrLineItem[] {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const items: OcrLineItem[] = [];

  for (const line of lines) {
    const lower = line.toLowerCase();
    if (SKIP_KEYWORDS.some((kw) => lower.includes(kw))) continue;

    const match = line.match(LINE_RE);
    if (!match) continue;

    let name = match[1].trim().replace(/^[-*•\d.\s]+/, '').trim();
    const price = Number(match[2]);
    if (!name || !Number.isFinite(price) || price <= 0 || price > 1000) continue;

    // strip a leading qty like "2x Iced Tea" or "2 Iced Tea"
    let qty = 1;
    const qtyMatch = name.match(/^(\d+)\s*[xX]?\s+(.+)$/);
    if (qtyMatch) {
      const parsedQty = Number(qtyMatch[1]);
      if (parsedQty > 0 && parsedQty < 50) {
        qty = parsedQty;
        name = qtyMatch[2].trim();
      }
    }

    if (name.length < 2) continue;
    items.push({ name, price, qty });
  }

  return items.slice(0, 30);
}

export async function extractReceiptItems(file: File): Promise<OcrLineItem[]> {
  const worker = await createWorker('eng');
  try {
    const { data } = await worker.recognize(file);
    return parseReceiptText(data.text);
  } finally {
    await worker.terminate();
  }
}
