import { useEffect, useState } from 'react';
import { colors, fonts } from '../theme';
import { fmt } from '../lib/currency';
import type { Item, Totals } from '../state/types';

// Number field that keeps what the user is typing (e.g. "-" or "-1.")
// and only reports a value to the bill once it parses as a number.
function NumberField({ value, onChange, min, placeholder, negative, autoFocus }: {
  value: number;
  onChange: (value: string) => void;
  min?: number;
  placeholder?: string;
  negative?: boolean;
  autoFocus?: boolean;
}) {
  const [draft, setDraft] = useState<string>(value === 0 && placeholder ? '' : String(value));

  // Pick up changes made outside this field (e.g. OCR fill).
  useEffect(() => {
    if (Number(draft) !== value) setDraft(value === 0 && placeholder ? '' : String(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <input
      value={draft}
      inputMode="decimal"
      placeholder={placeholder}
      autoFocus={autoFocus}
      onChange={(e) => {
        const raw = e.target.value;
        if (!/^-?\d*\.?\d*$/.test(raw)) return;
        if (min !== undefined && raw.startsWith('-')) return;
        setDraft(raw);
        const n = Number(raw);
        if (raw !== '' && raw !== '-' && raw !== '.' && raw !== '-.' && !Number.isNaN(n)) onChange(raw);
        else onChange('0');
      }}
      style={{
        width: '100%', boxSizing: 'border-box',
        border: `1px solid ${negative ? colors.red : colors.borderDashed}`, borderRadius: 5, padding: '4px 6px',
        fontFamily: fonts.mono, fontSize: 13, color: negative ? colors.red : colors.ink, background: colors.white,
      }}
    />
  );
}

export function ItemsTable({ items, totals, onUpdate, onRemove, onAdd, onAddDiscount }: {
  items: Item[];
  totals: Totals;
  onUpdate: (id: string, field: 'name' | 'price' | 'qty', value: string) => void;
  onRemove: (id: string) => void;
  onAdd: () => void;
  onAddDiscount: () => void;
}) {
  const lastId = items.length ? items[items.length - 1].id : null;

  return (
    <div style={{ flex: 1, minWidth: 300, background: colors.white, border: `1.5px solid ${colors.ink}`, borderRadius: 8, overflow: 'hidden' }}>
      <div className="items-grid" style={{
        display: 'grid', gap: 8, padding: '12px 16px',
        background: colors.panel, borderBottom: `1.5px solid ${colors.ink}`, fontFamily: fonts.mono,
        fontSize: 11, letterSpacing: '0.05em', color: colors.mutedLight,
      }}>
        <div>ITEM</div><div>PRICE</div><div>QTY</div><div>TOTAL</div><div></div>
      </div>

      {items.map((item) => {
        const lineTotal = item.price * item.qty;
        const isDiscount = lineTotal < 0 || item.name === 'Discount';
        return (
          <div key={item.id} className="items-grid" style={{
            display: 'grid', gap: 8, padding: '10px 16px',
            borderBottom: `1px dashed ${colors.borderDashed}`, alignItems: 'center',
          }}>
            <input
              value={item.name}
              onChange={(e) => onUpdate(item.id, 'name', e.target.value)}
              style={{ minWidth: 0, border: 'none', background: 'transparent', fontSize: 14, fontFamily: fonts.body, padding: 4, color: isDiscount ? colors.red : colors.ink }}
            />
            <NumberField
              value={item.price}
              onChange={(v) => onUpdate(item.id, 'price', v)}
              negative={lineTotal < 0}
              placeholder={item.name === 'Discount' ? '-50' : undefined}
              autoFocus={item.name === 'Discount' && item.id === lastId && item.price === 0}
            />
            <NumberField value={item.qty} min={0} onChange={(v) => onUpdate(item.id, 'qty', v)} />
            <div style={{ fontFamily: fonts.mono, fontSize: 13, color: lineTotal < 0 ? colors.red : colors.ink }}>{fmt(lineTotal)}</div>
            <div onClick={() => onRemove(item.id)} style={{ cursor: 'pointer', color: colors.mutedLight, textAlign: 'center' }}>✕</div>
          </div>
        );
      })}

      {items.length === 0 && (
        <div style={{ padding: '18px 16px 4px', fontSize: 13, color: colors.mutedLight, textAlign: 'center' }}>
          No items yet. Add them yourself, or upload your receipt below.
        </div>
      )}

      <div style={{ padding: '14px 16px', borderBottom: `1.5px solid ${colors.ink}`, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button
          type="button"
          onClick={onAdd}
          className="add-item-btn"
          style={{
            width: '100%', cursor: 'pointer', padding: '12px 16px',
            background: colors.orange, color: colors.ink,
            border: `2px solid ${colors.ink}`, borderRadius: 8,
            boxShadow: `3px 3px 0 ${colors.ink}`,
            fontFamily: fonts.headline, fontSize: 15, letterSpacing: '0.02em',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}
        >
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 22, height: 22, borderRadius: '50%', background: colors.ink, color: colors.orange,
            fontSize: 16, lineHeight: 1,
          }}>+</span>
          Add item manually
        </button>
        <button
          type="button"
          onClick={onAddDiscount}
          className="add-discount-btn"
          style={{
            alignSelf: 'center', cursor: 'pointer', padding: '6px 14px',
            background: 'transparent', color: colors.red,
            border: `1.5px dashed ${colors.red}`, borderRadius: 18,
            fontFamily: fonts.mono, fontSize: 12, letterSpacing: '0.04em',
          }}
        >
          − Add discount (negative price)
        </button>
      </div>

      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 4, fontFamily: fonts.mono, fontSize: 13 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: colors.mutedDark }}>
          <span>Subtotal</span><span>{fmt(totals.subtotal)}</span>
        </div>
        {totals.discountTotal < 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', color: colors.red }}>
            <span>Discounts</span><span>{fmt(totals.discountTotal)}</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700, color: colors.teal, marginTop: 4 }}>
          <span>Total</span><span>{fmt(totals.grandTotal)}</span>
        </div>
      </div>
    </div>
  );
}
