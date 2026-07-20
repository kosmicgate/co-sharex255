import { colors, fonts } from '../theme';

export function Header({ stepNum }: { stepNum: number }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 34 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 30, height: 30, border: `2px solid ${colors.ink}`, borderRadius: 7, position: 'relative', background: colors.orange }}>
          <div style={{ position: 'absolute', inset: 0, borderLeft: `2px dashed ${colors.ink}`, left: '50%' }} />
        </div>
        <div style={{ fontFamily: fonts.headline, fontSize: 16, letterSpacing: '0.01em' }}>Co-shareX255</div>
      </div>
      <div style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.mutedLight, letterSpacing: '0.06em' }}>
        STEP {stepNum} OF 4
      </div>
    </div>
  );
}
