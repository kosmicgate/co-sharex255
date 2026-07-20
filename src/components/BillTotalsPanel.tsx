import { colors, fonts } from '../theme';

export function BillTotalsPanel({ taxPct, tipPct, discountAmt, currencySymbol, onTaxChange, onTipChange, onDiscountChange }: {
  taxPct: number;
  tipPct: number;
  discountAmt: number;
  currencySymbol: string;
  onTaxChange: (v: number) => void;
  onTipChange: (v: number) => void;
  onDiscountChange: (v: number) => void;
}) {
  const fieldStyle: React.CSSProperties = {
    width: '100%', border: `1.5px solid ${colors.ink}`, borderRadius: 6, padding: '8px 10px',
    fontFamily: fonts.mono, fontSize: 13, background: colors.white,
  };
  const labelStyle: React.CSSProperties = { fontSize: 12, color: colors.mutedDark, marginBottom: 4 };

  return (
    <div style={{
      width: 280, flex: 'none', background: colors.panel, border: `1.5px solid ${colors.ink}`,
      borderTop: `4px solid ${colors.teal}`, borderRadius: 8, padding: 20,
      display: 'flex', flexDirection: 'column', gap: 14,
    }}>
      <div style={{ fontFamily: fonts.mono, fontSize: 12, letterSpacing: '0.08em', color: colors.mutedLight }}>BILL TOTALS</div>
      <div>
        <div style={labelStyle}>Tax %</div>
        <input value={taxPct} onChange={(e) => onTaxChange(Number(e.target.value) || 0)} type="number" style={fieldStyle} />
      </div>
      <div>
        <div style={labelStyle}>Tip %</div>
        <input value={tipPct} onChange={(e) => onTipChange(Number(e.target.value) || 0)} type="number" style={fieldStyle} />
      </div>
      <div>
        <div style={labelStyle}>Discount ({currencySymbol})</div>
        <input value={discountAmt} onChange={(e) => onDiscountChange(Number(e.target.value) || 0)} type="number" style={fieldStyle} />
      </div>
    </div>
  );
}
