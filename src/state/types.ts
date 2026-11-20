export interface Person {
  id: string;
  name: string;
}

export interface Item {
  id: string;
  name: string;
  price: number;
  qty: number;
  /** 'ocr' items are replaced when a new receipt photo is read; manual items are kept. */
  source?: 'ocr' | 'manual';
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
}

export interface PersonItemShare {
  itemId: string;
  name: string;
  amount: number;
}

export interface Totals {
  subtotal: number;
  discountTotal: number;
  grandTotal: number;
  perPersonTotal: Record<string, number>;
  perPersonItems: Record<string, PersonItemShare[]>;
}
