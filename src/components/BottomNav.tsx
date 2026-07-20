import { colors } from '../theme';

export function BottomNav({ step, disabled, onPrev, onNext }: {
  step: number;
  disabled?: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  const nextLabel = step === 3 ? 'Start over' : step === 0 ? 'Continue' : step === 1 ? 'Assign people' : 'Review summary';
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 36 }}>
      <div
        onClick={() => { if (step > 0) onPrev(); }}
        style={{
          cursor: step === 0 ? 'default' : 'pointer', opacity: step === 0 ? 0.3 : 1,
          border: `1.5px solid ${colors.ink}`, borderRadius: 6, padding: '12px 22px',
          fontSize: 14, fontWeight: 600, background: colors.white,
        }}
      >
        ← Back
      </div>
      <div
        onClick={() => { if (!disabled) onNext(); }}
        style={{
          cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1,
          border: `1.5px solid ${colors.ink}`, borderRadius: 6, padding: '12px 26px',
          fontSize: 14, fontWeight: 600, background: colors.ink, color: colors.background,
        }}
      >
        {nextLabel}
      </div>
    </div>
  );
}
