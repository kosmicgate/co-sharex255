import { ItemsTable } from '../components/ItemsTable';
import { PhotoUpload } from '../components/PhotoUpload';
import type { BillStateApi } from '../state/useBillState';

export function Step1Items({ bill }: { bill: BillStateApi }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
  );
}
