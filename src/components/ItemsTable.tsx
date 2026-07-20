import { colors, fonts } from '../theme';
import { fmt } from '../lib/currency';
import type { Item, Totals } from '../state/types';

export function ItemsTable({ items, totals, onUpdate, onRemove, onAdd }: {
  items: Item[];
  totals: Totals;
  onUpdate: (id: string, field: 'name' | 'price' | 'qty', value: string) => void;
  onRemove: (id: string) => void;
  onAdd: () => void;
}) {
  return (
    <div style={{ flex: 1, minWidth: 300, background: colors.white, border: `1.5px solid ${colors.ink}`, borderRadius: 8, overflow: 'hidden' }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 90px 60px 90px 32px', gap: 8, padding: '12px 16px',
        background: colors.panel, borderBottom: `1.5px solid ${colors.ink}`, fontFamily: fonts.mono,
        fontSize: 11, letterSpacing: '0.05em', color: colors.mutedLight,
      }}>
        <div>ITEM</div><div>PRICE</div><div>QTY</div><div>TOTAL</div><div></div>
      </div>

      {items.map((item) => (
        <div key={item.id} style={{
          display: 'grid', gridTemplateColumns: '1fr 90px 60px 90px 32px', gap: 8, padding: '10px 16px',
          borderBottom: `1px dashed ${colors.borderDashed}`, alignItems: 'center',
        }}>
          <input
            value={item.name}
            onChange={(e) => onUpdate(item.id, 'name', e.target.value)}
            style={{ border: 'none', background: 'transparent', fontSize: 14, fontFamily: fonts.body, padding: 4 }}
          />
          <input
            value={item.price}
            onChange={(e) => onUpdate(item.id, 'price', e.target.value)}
            type="number"
            style={{ border: `1px solid ${colors.borderDashed}`, borderRadius: 5, padding: '4px 6px', fontFamily: fonts.mono, fontSize: 13 }}
          />
          <input
            value={item.qty}
            onChange={(e) => onUpdate(item.id, 'qty', e.target.value)}
            type="number"
            min={1}
            style={{ border: `1px solid ${colors.borderDashed}`, borderRadius: 5, padding: '4px 6px', fontFamily: fonts.mono, fontSize: 13 }}
          />
          <div style={{ fontFamily: fonts.mono, fontSize: 13 }}>{fmt(item.price * item.qty)}</div>
          <div onClick={() => onRemove(item.id)} style={{ cursor: 'pointer', color: colors.mutedLight, textAlign: 'center' }}>✕</div>
        </div>
      ))}

      <div
        onClick={onAdd}
        style={{ cursor: 'pointer', padding: '12px 16px', fontSize: 13, color: colors.mutedDark, textAlign: 'center', borderBottom: `1.5px solid ${colors.ink}` }}
      >
        + Add item manually
      </div>

      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 4, fontFamily: fonts.mono, fontSize: 13 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: colors.mutedDark }}>
          <span>Subtotal</span><span>{fmt(totals.subtotal)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: colors.mutedDark }}>
          <span>Tax + Tip</span><span>{fmt(totals.taxAmt + totals.tipAmt)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: colors.mutedDark }}>
          <span>Discount</span><span>-{fmt(totals.discountAmt)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700, color: colors.teal, marginTop: 4 }}>
          <span>Total</span><span>{fmt(totals.grandTotal)}</span>
        </div>
      </div>
    </div>
  );
}
