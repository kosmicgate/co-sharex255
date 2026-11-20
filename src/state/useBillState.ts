import { useCallback, useMemo, useState } from 'react';
import type { Assignment, Item, Person, SplitMode } from './types';
import { computeTotals } from './computeTotals';
import { getInvalidManualItemIds } from './validation';

function defaultPeople(): Person[] {
  return [
    { id: 'p1', name: 'Boat' },
    { id: 'p2', name: 'Oil' },
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

  // A new receipt scan replaces items from any earlier scan but keeps
  // anything the user typed in by hand.
  const addItemsFromOcr = useCallback((seed: { name: string; price: number; qty: number }[]) => {
    const newItems: Item[] = seed.map((it) => ({ id: nextId('i'), ...it, source: 'ocr' }));
    setItems((prevItems) => {
      const removedIds = prevItems.filter((it) => it.source === 'ocr').map((it) => it.id);
      const kept = prevItems.filter((it) => it.source !== 'ocr');
      setAssignments((prevAssign) => {
        const next = { ...prevAssign };
        removedIds.forEach((id) => { delete next[id]; });
        newItems.forEach((it) => {
          next[it.id] = { mode: 'equal', included: people.map((p) => p.id), percents: {} };
        });
        return next;
      });
      setActiveItemId((prevActive) => {
        if (prevActive && !removedIds.includes(prevActive)) return prevActive;
        return newItems[0]?.id ?? kept[0]?.id ?? null;
      });
      return [...newItems, ...kept];
    });
  }, [people]);

  const addItem = useCallback((name: string = 'New item') => {
    const id = nextId('i');
    const item: Item = { id, name, price: 0, qty: 1, source: 'manual' };
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
    () => computeTotals({ people, items, assignments }),
    [people, items, assignments],
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
  }, []);

  return {
    step, setStep,
    people, addPerson, removePerson,
    photoUrl, setPhoto,
    items, addItemsFromOcr, addItem, updateItem, removeItem,
    activeItemId, setActiveItemId,
    assignments, togglePersonForItem, setMode, setPercent,
    totals, invalidItemIds,
    reset,
  };
}

export type BillStateApi = ReturnType<typeof useBillState>;
