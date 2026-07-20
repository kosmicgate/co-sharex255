import { colors, fonts } from '../theme';
import { fmt } from '../lib/currency';
import type { Person } from '../state/types';

export function PersonCards({ people, perPersonTotal }: { people: Person[]; perPersonTotal: Record<string, number> }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
      {people.map((p, i) => {
        const accent = i % 2 === 0 ? colors.orange : colors.teal;
        return (
          <div key={p.id} style={{
            background: colors.panel, border: `1.5px solid ${colors.ink}`, borderTop: `4px solid ${accent}`,
            borderRadius: 8, padding: 18,
          }}>
            <div style={{ fontFamily: fonts.mono, fontSize: 11, letterSpacing: '0.06em', color: colors.mutedLight }}>
              {p.name.toUpperCase()}
            </div>
            <div style={{ fontFamily: fonts.headline, fontSize: 30, marginTop: 8, color: accent }}>
              {fmt(perPersonTotal[p.id] || 0)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
