import { useCallback, useMemo, useState } from 'react';
import type { Assignment, Item, Person, SplitMode } from './types';
import { computeTotals } from './computeTotals';
import { getInvalidManualItemIds } from './validation';

const DEFAULT_TAX_PCT = 8.5;
const DEFAULT_TIP_PCT = 18;

function defaultPeople(): Person[] {
  return [
    { id: 'p1', name: 'Alex' },
    { id: 'p2', name: 'Sam' },
  ];
}

let idCounter = 1;
function nextId(prefix: string): string {
  return prefix + Date.now() + '-' + idCounter++;
}

export function useBillState() {
  const [step, setStep] = useState(0);
  const [people, setPeople] = useState<Person[]>(defaultPeople());
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<Record<string, Assignment>>({});
  const [taxPct, setTaxPct] = useState<number>(DEFAULT_TAX_PCT);
  const [tipPct, setTipPct] = useState<number>(DEFAULT_TIP_PCT);
  const [discountAmt, setDiscountAmt] = useState<number>(0);

  const addPerson = useCallback((name: string) => {
    if (!name || !name.trim()) return;
    const id = nextId('p');
    const trimmed = name.trim();
    setPeople((prev) => [...prev, { id, name: trimmed }]);
    setAssignments((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((itemId) => {
        const a = next[itemId];
        if (a.mode === 'equal') {
          next[itemId] = { ...a, included: [...a.included, id] };
        }
      });
      return next;
    });
  }, []);

  const removePerson = useCallback((id: string) => {
    setPeople((prev) => prev.filter((p) => p.id !== id));
    setAssignments((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((itemId) => {
        const a = next[itemId];
        const included = a.included.filter((pid) => pid !== id);
        const percents = { ...a.percents };
        delete percents[id];
        next[itemId] = { ...a, included, percents };
      });
      return next;
    });
  }, []);

  const setPhoto = useCallback((url: string | null) => {
    setPhotoUrl(url);
  }, []);

  const addItemsFromOcr = useCallback((seed: { name: string; price: number; qty: number }[]) => {
    if (seed.length === 0) return;
    setItems((prevItems) => {
      if (prevItems.length > 0) return prevItems;
      const newItems = seed.map((it) => ({ id: nextId('i'), ...it }));
      setAssignments((prevAssign) => {
        const next = { ...prevAssign };
        newItems.forEach((it) => {
          next[it.id] = { mode: 'equal', included: people.map((p) => p.id), percents: {} };
        });
        return next;
      });
      setActiveItemId((prevActive) => prevActive ?? (newItems[0] ? newItems[0].id : prevActive));
      return newItems;
    });
  }, [people]);

  const addItem = useCallback(() => {
    const id = nextId('i');
    const item: Item = { id, name: 'New item', price: 0, qty: 1 };
    setItems((prev) => [...prev, item]);
    setAssignments((prev) => ({ ...prev, [id]: { mode: 'equal', included: people.map((p) => p.id), percents: {} } }));
    setActiveItemId((prev) => prev ?? id);
  }, [people]);

  const updateItem = useCallback((id: string, field: 'name' | 'price' | 'qty', value: string) => {
    setItems((prev) => prev.map((it) => it.id === id
      ? { ...it, [field]: field === 'price' || field === 'qty' ? Number(value) || 0 : value }
      : it));
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    setAssignments((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setActiveItemId((prev) => (prev === id ? null : prev));
  }, []);

  const togglePersonForItem = useCallback((itemId: string, personId: string) => {
    setAssignments((prev) => {
      const a = prev[itemId] || { mode: 'equal' as SplitMode, included: [], percents: {} };
      const included = a.included.includes(personId)
        ? a.included.filter((id) => id !== personId)
        : [...a.included, personId];
      return { ...prev, [itemId]: { ...a, included } };
    });
  }, []);

  const setMode = useCallback((itemId: string, mode: SplitMode) => {
    setAssignments((prev) => {
      const a = prev[itemId];
      if (!a) return prev;
      const percents = { ...a.percents };
      if (mode === 'manual' && a.included.length) {
        const even = 100 / a.included.length;
        a.included.forEach((id) => { if (percents[id] == null) percents[id] = Math.round(even); });
      }
      return { ...prev, [itemId]: { ...a, mode, percents } };
    });
  }, []);

  const setPercent = useCallback((itemId: string, personId: string, value: string) => {
    setAssignments((prev) => {
      const a = prev[itemId];
      if (!a) return prev;
      return { ...prev, [itemId]: { ...a, percents: { ...a.percents, [personId]: Number(value) } } };
    });
  }, []);

  const totals = useMemo(
    () => computeTotals({ people, items, assignments, taxPct, tipPct, discountAmt }),
    [people, items, assignments, taxPct, tipPct, discountAmt],
  );

  const invalidItemIds = useMemo(
    () => getInvalidManualItemIds(items, assignments),
    [items, assignments],
  );

  const reset = useCallback(() => {
    setStep(0);
    setPeople(defaultPeople());
    setPhotoUrl(null);
    setItems([]);
    setActiveItemId(null);
    setAssignments({});
    setTaxPct(DEFAULT_TAX_PCT);
    setTipPct(DEFAULT_TIP_PCT);
    setDiscountAmt(0);
  }, []);

  return {
    step, setStep,
    people, addPerson, removePerson,
    photoUrl, setPhoto,
    items, addItemsFromOcr, addItem, updateItem, removeItem,
    activeItemId, setActiveItemId,
    assignments, togglePersonForItem, setMode, setPercent,
    taxPct, setTaxPct, tipPct, setTipPct, discountAmt, setDiscountAmt,
    totals, invalidItemIds,
    reset,
  };
}

export type BillStateApi = ReturnType<typeof useBillState>;
