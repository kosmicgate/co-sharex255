import { PersonCards } from '../components/PersonCard';
import type { BillStateApi } from '../state/useBillState';

export function Step3Summary({ bill }: { bill: BillStateApi }) {
  return (
    <PersonCards
      people={bill.people}
      perPersonTotal={bill.totals.perPersonTotal}
      perPersonItems={bill.totals.perPersonItems}
    />
  );
}
