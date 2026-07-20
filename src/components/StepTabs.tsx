import { colors, fonts } from '../theme';

const STEP_META = [
  { num: '1', title: 'UPLOAD', sub: 'photo + people' },
  { num: '2', title: 'ITEMS', sub: 'edit line items' },
  { num: '3', title: 'ASSIGN', sub: 'split each item' },
  { num: '4', title: 'SUMMARY', sub: 'who owes what' },
];

export function StepTabs({ step, disabledSteps, onSelect }: {
  step: number;
  disabledSteps?: Set<number>;
  onSelect: (i: number) => void;
}) {
  return (
    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
      {STEP_META.map((tab, i) => {
        const isDisabled = disabledSteps?.has(i) ?? false;
        return (
          <div
            key={tab.num}
            onClick={() => { if (!isDisabled) onSelect(i); }}
            style={{
              cursor: isDisabled ? 'not-allowed' : 'pointer', opacity: isDisabled ? 0.4 : 1,
              border: `1.5px solid ${colors.ink}`, borderRadius: 7, padding: '10px 16px',
              textAlign: 'center', minWidth: 120,
              background: i === step ? colors.orangeLight : colors.background,
              borderColor: i === step ? colors.orange : colors.ink,
            }}
          >
            <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 13, letterSpacing: '0.04em' }}>
              {tab.num} {tab.title}
            </div>
            <div style={{ fontSize: 11, color: colors.mutedLight, marginTop: 2 }}>{tab.sub}</div>
          </div>
        );
      })}
    </div>
  );
}

export const STEP_SUBTITLES = [
  "Snap the receipt and say who's in.",
  'Check the line items pulled from your photo.',
  'Tap who had what, then split it.',
  "Here's what everyone owes.",
];
