import { colors, fonts } from '../theme';

export function Hero({ subtitle }: { subtitle: string }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 26 }}>
      <h1 style={{ fontFamily: fonts.headline, fontSize: 'clamp(32px, 5vw, 56px)', margin: 0, letterSpacing: '-0.01em' }}>
        SPLIT THE BILL
      </h1>
      <p style={{ margin: '10px 0 0', color: colors.mutedDark, fontSize: 16 }}>{subtitle}</p>
    </div>
  );
}
