import type { Assignment, BillData, Item, PersonItemShare, Totals } from './types';

function personShare(assignment: Assignment | undefined, personId: string): number {
  if (!assignment || !assignment.included.includes(personId)) return 0;
  if (assignment.mode === 'equal') return 1 / assignment.included.length;
  return (assignment.percents[personId] || 0) / 100;
}

export function computeTotals(bill: Pick<BillData, 'people' | 'items' | 'assignments'>): Totals {
  const { people, items, assignments } = bill;
  // Discounts are entered as items with a negative price.
  const lineTotals = items.map((it: Item) => it.price * it.qty);
  const subtotal = lineTotals.filter((v) => v > 0).reduce((a, b) => a + b, 0);
  const discountTotal = lineTotals.filter((v) => v < 0).reduce((a, b) => a + b, 0);
  const grandTotal = subtotal + discountTotal;

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

  const perPersonTotal: Record<string, number> = { ...perPersonSubtotal };

  return {
    subtotal, discountTotal, grandTotal,
    perPersonTotal, perPersonItems,
  };
}
