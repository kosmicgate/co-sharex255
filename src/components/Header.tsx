import { colors, fonts } from '../theme';

export function Header({ stepNum }: { stepNum: number }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 34 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <svg width="28" height="32" viewBox="0 0 30 34">
          <path
            d="M3 2 H27 V32 L23 29 L19 32 L15 29 L11 32 L7 29 L3 32 Z"
            fill={colors.white}
            stroke={colors.ink}
            strokeWidth={2}
          />
          <line x1="8" y1="11" x2="22" y2="11" stroke={colors.ink} strokeWidth={2} />
          <line x1="8" y1="17" x2="22" y2="17" stroke={colors.teal} strokeWidth={2} />
          <line x1="8" y1="23" x2="18" y2="23" stroke={colors.ink} strokeWidth={2} />
        </svg>
        <div style={{ fontFamily: fonts.headline, fontSize: 16, letterSpacing: '0.01em' }}>Co-share</div>
      </div>
      <div style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.mutedLight, letterSpacing: '0.06em' }}>
        STEP {stepNum} OF 4
      </div>
    </div>
  );
}
