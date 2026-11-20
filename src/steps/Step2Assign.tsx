import { ItemSelector } from '../components/ItemSelector';
import { AssignDetail } from '../components/AssignDetail';
import { PeoplePanel } from '../components/PeoplePanel';
import { AssignGuide } from '../components/AssignGuide';
import type { BillStateApi } from '../state/useBillState';
import type { Assignment } from '../state/types';

const EMPTY_ASSIGNMENT: Assignment = { mode: 'equal', included: [], percents: {} };

export function Step2Assign({ bill }: { bill: BillStateApi }) {
  const activeItem = bill.items.find((it) => it.id === bill.activeItemId) || bill.items[0] || null;
  const assignment = activeItem ? (bill.assignments[activeItem.id] || EMPTY_ASSIGNMENT) : EMPTY_ASSIGNMENT;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    <AssignGuide />
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <div className="assign-side" style={{ width: 280, maxWidth: '100%', flex: 'none', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <PeoplePanel people={bill.people} onAdd={bill.addPerson} onRemove={bill.removePerson} />
        <ItemSelector
          items={bill.items}
          activeItemId={activeItem?.id ?? null}
          invalidItemIds={bill.invalidItemIds}
          onSelect={bill.setActiveItemId}
        />
      </div>
      <AssignDetail
        item={activeItem}
        assignment={assignment}
        people={bill.people}
        onTogglePerson={(personId) => activeItem && bill.togglePersonForItem(activeItem.id, personId)}
        onSetMode={(mode) => activeItem && bill.setMode(activeItem.id, mode)}
        onSetPercent={(personId, value) => activeItem && bill.setPercent(activeItem.id, personId, value)}
      />
    </div>
    </div>
  );
}
