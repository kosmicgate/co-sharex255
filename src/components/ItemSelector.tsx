import { colors, fonts } from '../theme';
import { fmt } from '../lib/currency';
import type { Item } from '../state/types';

export function ItemSelector({ items, activeItemId, onSelect }: {
  items: Item[];
  activeItemId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div style={{
      width: 280, flex: 'none', background: colors.panel, border: `1.5px solid ${colors.ink}`,
      borderTop: `4px solid ${colors.orange}`, borderRadius: 8, padding: 12,
      display: 'flex', flexDirection: 'column', gap: 6,
    }}>
      <div style={{ fontFamily: fonts.mono, fontSize: 12, letterSpacing: '0.08em', color: colors.mutedLight, padding: '0 8px' }}>ITEMS</div>
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => onSelect(item.id)}
          style={{
            cursor: 'pointer', display: 'flex', justifyContent: 'space-between', padding: '10px 8px',
            borderRadius: 6, fontSize: 13, background: item.id === activeItemId ? colors.orangeLight : 'transparent',
          }}
        >
          <span>{item.name}</span>
          <span style={{ fontFamily: fonts.mono }}>{fmt(item.price * item.qty)}</span>
        </div>
      ))}
    </div>
  );
}
