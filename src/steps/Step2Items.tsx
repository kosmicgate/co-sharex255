import { BillTotalsPanel } from '../components/BillTotalsPanel';
import { ItemsTable } from '../components/ItemsTable';
import type { BillStateApi } from '../state/useBillState';

export function Step2Items({ bill }: { bill: BillStateApi }) {
  return (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <BillTotalsPanel
        taxPct={bill.taxPct}
        tipPct={bill.tipPct}
        discountAmt={bill.discountAmt}
        currencySymbol="$"
        onTaxChange={bill.setTaxPct}
        onTipChange={bill.setTipPct}
        onDiscountChange={bill.setDiscountAmt}
      />
      <ItemsTable
        items={bill.items}
        totals={bill.totals}
        onUpdate={bill.updateItem}
        onRemove={bill.removeItem}
        onAdd={bill.addItem}
      />
    </div>
  );
}
