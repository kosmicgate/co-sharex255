export interface Person {
  id: string;
  name: string;
}

export interface Item {
  id: string;
  name: string;
  price: number;
  qty: number;
}

export type SplitMode = 'equal' | 'manual';

export interface Assignment {
  mode: SplitMode;
  included: string[];
  percents: Record<string, number>;
}

export interface BillData {
  people: Person[];
  items: Item[];
  assignments: Record<string, Assignment>;
  taxPct: number;
  tipPct: number;
  discountAmt: number;
}

export interface PersonItemShare {
  itemId: string;
  name: string;
  amount: number;
}

export interface Totals {
  subtotal: number;
  taxPct: number;
  tipPct: number;
  discountAmt: number;
  taxAmt: number;
  tipAmt: number;
  grandTotal: number;
  perPersonTotal: Record<string, number>;
  perPersonItems: Record<string, PersonItemShare[]>;
  perPersonExtra: Record<string, number>;
}
