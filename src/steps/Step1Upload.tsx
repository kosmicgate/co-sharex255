import { PeoplePanel } from '../components/PeoplePanel';
import { PhotoUpload } from '../components/PhotoUpload';
import type { BillStateApi } from '../state/useBillState';

export function Step1Upload({ bill }: { bill: BillStateApi }) {
  return (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'stretch' }}>
      <PeoplePanel people={bill.people} onAdd={bill.addPerson} onRemove={bill.removePerson} />
      <PhotoUpload
        photoUrl={bill.photoUrl}
        hasItems={bill.items.length > 0}
        onPhoto={bill.setPhoto}
        onItemsExtracted={bill.addItemsFromOcr}
      />
    </div>
  );
}
