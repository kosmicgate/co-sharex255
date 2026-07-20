import { ItemSelector } from '../components/ItemSelector';
import { AssignDetail } from '../components/AssignDetail';
import type { BillStateApi } from '../state/useBillState';
import type { Assignment } from '../state/types';

const EMPTY_ASSIGNMENT: Assignment = { mode: 'equal', included: [], percents: {} };

export function Step3Assign({ bill }: { bill: BillStateApi }) {
  const activeItem = bill.items.find((it) => it.id === bill.activeItemId) || bill.items[0] || null;
  const assignment = activeItem ? (bill.assignments[activeItem.id] || EMPTY_ASSIGNMENT) : EMPTY_ASSIGNMENT;

  return (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <ItemSelector
        items={bill.items}
        activeItemId={activeItem?.id ?? null}
        invalidItemIds={bill.invalidItemIds}
        onSelect={bill.setActiveItemId}
      />
      <AssignDetail
        item={activeItem}
        assignment={assignment}
        people={bill.people}
        onTogglePerson={(personId) => activeItem && bill.togglePersonForItem(activeItem.id, personId)}
        onSetMode={(mode) => activeItem && bill.setMode(activeItem.id, mode)}
        onSetPercent={(personId, value) => activeItem && bill.setPercent(activeItem.id, personId, value)}
      />
    </div>
  );
}
