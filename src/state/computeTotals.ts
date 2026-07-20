import type { Assignment, BillData, Item, PersonItemShare, Totals } from './types';

function personShare(assignment: Assignment | undefined, personId: string): number {
  if (!assignment || !assignment.included.includes(personId)) return 0;
  if (assignment.mode === 'equal') return 1 / assignment.included.length;
  return (assignment.percents[personId] || 0) / 100;
}

export function computeTotals(bill: Pick<BillData, 'people' | 'items' | 'assignments' | 'taxPct' | 'tipPct' | 'discountAmt'>): Totals {
  const { people, items, assignments, taxPct, tipPct, discountAmt } = bill;
  const subtotal = items.reduce((sum: number, it: Item) => sum + it.price * it.qty, 0);
  const taxAmt = subtotal * taxPct / 100;
  const tipAmt = subtotal * tipPct / 100;
  const grandTotal = subtotal + taxAmt + tipAmt - discountAmt;

  const perPersonSubtotal: Record<string, number> = {};
  const perPersonItems: Record<string, PersonItemShare[]> = {};
  people.forEach((p) => { perPersonSubtotal[p.id] = 0; perPersonItems[p.id] = []; });
  items.forEach((it) => {
    const itemTotal = it.price * it.qty;
    people.forEach((p) => {
      const share = personShare(assignments[it.id], p.id);
      if (share <= 0) return;
      const amount = itemTotal * share;
      perPersonSubtotal[p.id] += amount;
      perPersonItems[p.id].push({ itemId: it.id, name: it.name, amount });
    });
  });

  const extra = taxAmt + tipAmt - discountAmt;
  const perPersonTotal: Record<string, number> = {};
  const perPersonExtra: Record<string, number> = {};
  people.forEach((p) => {
    const share = subtotal > 0 ? perPersonSubtotal[p.id] / subtotal : 0;
    perPersonExtra[p.id] = share * extra;
    perPersonTotal[p.id] = perPersonSubtotal[p.id] + perPersonExtra[p.id];
  });

  return {
    subtotal, taxPct, tipPct, discountAmt, taxAmt, tipAmt, grandTotal,
    perPersonTotal, perPersonItems, perPersonExtra,
  };
}
