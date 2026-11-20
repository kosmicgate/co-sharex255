import { ItemsTable } from '../components/ItemsTable';
import { PeoplePanel } from '../components/PeoplePanel';
import { PhotoUpload } from '../components/PhotoUpload';
import type { BillStateApi } from '../state/useBillState';

export function Step1Items({ bill }: { bill: BillStateApi }) {
  return (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <div style={{ flex: 1, minWidth: 300, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <ItemsTable
          items={bill.items}
          totals={bill.totals}
          onUpdate={bill.updateItem}
          onRemove={bill.removeItem}
          onAdd={() => bill.addItem()}
          onAddDiscount={() => bill.addItem('Discount')}
        />
        <PhotoUpload
          photoUrl={bill.photoUrl}
          onPhoto={bill.setPhoto}
          onItemsExtracted={bill.addItemsFromOcr}
        />
      </div>
      <PeoplePanel people={bill.people} onAdd={bill.addPerson} onRemove={bill.removePerson} />
    </div>
  );
}
