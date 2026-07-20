import { useState } from 'react';
import { colors, fonts } from '../theme';
import type { Person } from '../state/types';

export function PeoplePanel({ people, onAdd, onRemove }: {
  people: Person[];
  onAdd: (name: string) => void;
  onRemove: (id: string) => void;
}) {
  const [name, setName] = useState('');

  const submit = () => {
    onAdd(name);
    setName('');
  };

  return (
    <div style={{
      width: 280, flex: 'none', background: colors.panel, border: `1.5px solid ${colors.ink}`,
      borderTop: `4px solid ${colors.orange}`, borderRadius: 8, padding: 20,
      display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      <div style={{ fontFamily: fonts.mono, fontSize: 12, letterSpacing: '0.08em', color: colors.mutedLight }}>PEOPLE</div>
      <div style={{ fontSize: 13, color: colors.mutedDark, marginTop: -6 }}>Who's splitting this bill?</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {people.map((person) => (
          <div key={person.id} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, border: `1.5px solid ${colors.ink}`,
            borderRadius: 18, padding: '4px 6px 4px 12px', background: colors.white, fontSize: 13,
          }}>
            <span>{person.name}</span>
            <span
              onClick={() => onRemove(person.id)}
              style={{
                cursor: 'pointer', width: 16, height: 16, borderRadius: '50%', background: colors.ink,
                color: colors.background, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              ✕
            </span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
          placeholder="Add a name"
          style={{
            flex: 1, border: `1.5px solid ${colors.ink}`, borderRadius: 6, padding: '8px 10px',
            fontFamily: fonts.body, fontSize: 13, background: colors.white,
          }}
        />
        <div
          onClick={submit}
          style={{
            cursor: 'pointer', border: `1.5px solid ${colors.ink}`, borderRadius: 6, width: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'center', background: colors.ink,
            color: colors.background, fontSize: 16,
          }}
        >
          +
        </div>
      </div>
    </div>
  );
}
