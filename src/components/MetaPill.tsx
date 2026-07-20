import { colors, fonts } from '../theme';

export function MetaPill({ peopleCount, itemsCount, subtotalFmt }: { peopleCount: number; itemsCount: number; subtotalFmt: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        border: `1.5px solid ${colors.ink}`, borderRadius: 22, padding: '8px 18px',
        background: colors.panel, fontFamily: fonts.mono, fontSize: 12,
      }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: colors.teal, display: 'inline-block' }} />
        <span>{peopleCount}{peopleCount === 1 ? ' PERSON' : ' PEOPLE'}</span>
        <span style={{ color: colors.borderDashedAlt }}>|</span>
        <span>{itemsCount}{itemsCount === 1 ? ' ITEM' : ' ITEMS'}</span>
        <span style={{ color: colors.borderDashedAlt }}>|</span>
        <span>SUBTOTAL {subtotalFmt}</span>
      </div>
    </div>
  );
}
