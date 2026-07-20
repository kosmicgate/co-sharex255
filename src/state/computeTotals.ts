import type { Assignment, BillData, Item, Totals } from './types';

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
  people.forEach((p) => { perPersonSubtotal[p.id] = 0; });
  items.forEach((it) => {
    const itemTotal = it.price * it.qty;
    people.forEach((p) => {
      perPersonSubtotal[p.id] += itemTotal * personShare(assignments[it.id], p.id);
    });
  });

  const extra = taxAmt + tipAmt - discountAmt;
  const perPersonTotal: Record<string, number> = {};
  people.forEach((p) => {
    const share = subtotal > 0 ? perPersonSubtotal[p.id] / subtotal : 0;
    perPersonTotal[p.id] = perPersonSubtotal[p.id] + share * extra;
  });

  return { subtotal, taxPct, tipPct, discountAmt, taxAmt, tipAmt, grandTotal, perPersonTotal };
}
