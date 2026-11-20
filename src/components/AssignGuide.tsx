import { colors, fonts } from '../theme';
import { StepBadge } from './StepBadge';

const STEPS = [
  { title: 'Select an item to split', hint: 'Pick it from the Items list.' },
  { title: 'Choose who pays for it', hint: 'Tap names to add or remove people.' },
  { title: 'Split equally or by manual %', hint: 'Manual % must add up to 100%.' },
];

export function AssignGuide() {
  return (
    <div className="assign-guide" style={{
      display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12,
      border: `1.5px solid ${colors.ink}`, borderRadius: 8, background: colors.white, padding: '14px 16px',
    }}>
      {STEPS.map((s, i) => (
        <div key={s.title} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <StepBadge n={i + 1} size={24} />
          <div>
            <div style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: 14 }}>{s.title}</div>
            <div style={{ fontSize: 12, color: colors.mutedLight, marginTop: 2 }}>{s.hint}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
