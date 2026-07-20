import { isSupabaseConfigured, supabase } from './supabaseClient';
import type { BillData } from '../state/types';

function fakeId(bill: BillData): string {
  const initials = bill.people.length
    ? bill.people.map((p) => p.name.slice(0, 1)).join('').toLowerCase()
    : 'xxxx';
  return initials + Math.abs(Date.now() % 100000).toString(36);
}

export interface SaveBillResult {
  id: string;
  persisted: boolean;
}

export async function saveBill(bill: BillData): Promise<SaveBillResult> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('bills').insert({ data: bill }).select('id').single();
    if (error) {
      console.error('Failed to persist bill, falling back to local link', error);
      return { id: fakeId(bill), persisted: false };
    }
    return { id: data.id as string, persisted: true };
  }
  return { id: fakeId(bill), persisted: false };
}

export async function loadBill(id: string): Promise<BillData | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase.from('bills').select('data').eq('id', id).single();
  if (error || !data) return null;
  return data.data as BillData;
}

export function buildShareUrl(id: string): string {
  const base = `${window.location.origin}${window.location.pathname}`;
  return `${base}#/s/${id}`;
}
