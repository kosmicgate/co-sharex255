import { PersonCards } from '../components/PersonCard';
import type { BillStateApi } from '../state/useBillState';

export function Step4Summary({ bill }: { bill: BillStateApi }) {
  return (
    <PersonCards
      people={bill.people}
      perPersonTotal={bill.totals.perPersonTotal}
      perPersonItems={bill.totals.perPersonItems}
      perPersonExtra={bill.totals.perPersonExtra}
    />
  );
}
