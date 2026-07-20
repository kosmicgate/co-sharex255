import { colors, fonts } from '../theme';
import { fmt } from '../lib/currency';
import type { Assignment, Item, Person } from '../state/types';

export function AssignDetail({ item, assignment, people, onTogglePerson, onSetMode, onSetPercent }: {
  item: Item | null;
  assignment: Assignment;
  people: Person[];
  onTogglePerson: (personId: string) => void;
  onSetMode: (mode: 'equal' | 'manual') => void;
  onSetPercent: (personId: string, value: string) => void;
}) {
  const isEqual = assignment.mode === 'equal';
  const isManual = assignment.mode === 'manual';
  const includedCount = assignment.included.length;
  const equalEach = item && includedCount ? fmt((item.price * item.qty) / includedCount) : fmt(0);
  const sumPercent = assignment.included.reduce((sum, pid) => sum + (assignment.percents[pid] || 0), 0);
  const sumColor = sumPercent === 100 ? colors.teal : colors.red;

  const modeBtnStyle = (active: boolean): React.CSSProperties => ({
    cursor: 'pointer', border: `1.5px solid ${colors.ink}`, borderRadius: 6, padding: '8px 14px',
    fontSize: 13, background: active ? colors.ink : colors.white, color: active ? colors.background : colors.ink,
  });

  return (
    <div style={{
      flex: 1, minWidth: 300, background: colors.white, border: `1.5px solid ${colors.ink}`,
      borderRadius: 8, padding: 22, display: 'flex', flexDirection: 'column', gap: 16,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ fontSize: 18, fontWeight: 700 }}>{item ? item.name : 'No items yet'}</div>
        <div style={{ fontFamily: fonts.mono, color: colors.mutedDark }}>{item ? fmt(item.price * item.qty) : ''}</div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {people.map((p) => {
          const included = assignment.included.includes(p.id);
          return (
            <div
              key={p.id}
              onClick={() => onTogglePerson(p.id)}
              style={{
                cursor: 'pointer', border: `1.5px solid ${colors.ink}`, borderRadius: 18, padding: '6px 14px',
                fontSize: 13, background: included ? colors.orangeLight : colors.white,
              }}
            >
              {p.name}
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <div onClick={() => onSetMode('equal')} style={modeBtnStyle(isEqual)}>Split equally</div>
        <div onClick={() => onSetMode('manual')} style={modeBtnStyle(isManual)}>Manual %</div>
      </div>

      {isManual && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {assignment.included.map((pid) => {
            const p = people.find((pp) => pp.id === pid);
            const percent = assignment.percents[pid] ?? 0;
            return (
              <div key={pid} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 60, fontSize: 13 }}>{p ? p.name : ''}</div>
                <input
                  type="range" min={0} max={100} value={percent}
                  onChange={(e) => onSetPercent(pid, e.target.value)}
                  style={{ flex: 1 }}
                />
                <div style={{ width: 44, fontFamily: fonts.mono, fontSize: 13, textAlign: 'right' }}>{percent}%</div>
              </div>
            );
          })}
          <div style={{ fontFamily: fonts.mono, fontSize: 12, color: sumColor }}>
            Total assigned: {sumPercent}%
            {sumPercent !== 100 && ' — must equal 100% to continue'}
          </div>
        </div>
      )}

      {isEqual && (
        <div style={{ fontSize: 13, color: colors.mutedDark }}>
          Split evenly across {includedCount} people — {equalEach} each.
        </div>
      )}
    </div>
  );
}
