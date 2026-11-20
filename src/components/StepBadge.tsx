import { colors, fonts } from '../theme';

// Small numbered circle that ties a part of the Assign page to the guide at the top.
export function StepBadge({ n, size = 20 }: { n: number; size?: number }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none',
      width: size, height: size, borderRadius: '50%', background: colors.orange, color: colors.ink,
      border: `1.5px solid ${colors.ink}`, fontFamily: fonts.headline, fontSize: size * 0.55, lineHeight: 1,
    }}>
      {n}
    </span>
  );
}

export function SectionLabel({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: fonts.mono, fontSize: 12, letterSpacing: '0.06em', color: colors.mutedDark }}>
      <StepBadge n={n} />
      {children}
    </div>
  );
}
