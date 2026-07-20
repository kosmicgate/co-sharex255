import { colors, fonts } from '../theme';
import { fmt } from '../lib/currency';
import type { Person, PersonItemShare } from '../state/types';

export function PersonCards({ people, perPersonTotal, perPersonItems, perPersonExtra }: {
  people: Person[];
  perPersonTotal: Record<string, number>;
  perPersonItems: Record<string, PersonItemShare[]>;
  perPersonExtra: Record<string, number>;
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
      {people.map((p, i) => {
        const accent = i % 2 === 0 ? colors.orange : colors.teal;
        const items = perPersonItems[p.id] || [];
        const extra = perPersonExtra[p.id] || 0;
        return (
          <div key={p.id} style={{
            background: colors.panel, border: `1.5px solid ${colors.ink}`, borderTop: `4px solid ${accent}`,
            borderRadius: 8, padding: 18, display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            <div style={{ fontFamily: fonts.mono, fontSize: 11, letterSpacing: '0.06em', color: colors.mutedLight }}>
              {p.name.toUpperCase()}
            </div>
            <div style={{ fontFamily: fonts.headline, fontSize: 30, color: accent }}>
              {fmt(perPersonTotal[p.id] || 0)}
            </div>

            {items.length > 0 && (
              <div style={{
                display: 'flex', flexDirection: 'column', gap: 4, fontFamily: fonts.mono, fontSize: 12,
                borderTop: `1px dashed ${colors.borderDashed}`, paddingTop: 10, marginTop: 2,
              }}>
                {items.map((it) => (
                  <div key={it.itemId} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, color: colors.mutedDark }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.name}</span>
                    <span style={{ flex: 'none' }}>{fmt(it.amount)}</span>
                  </div>
                ))}
                {extra !== 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, color: colors.mutedDark }}>
                    <span>Tax + tip</span>
                    <span style={{ flex: 'none' }}>{fmt(extra)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
