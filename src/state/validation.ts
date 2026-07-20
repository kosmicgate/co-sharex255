import type { Assignment, Item } from './types';

// An item in manual-split mode is only valid once its included people's
// percents add up to exactly 100 — otherwise part of (or more than) the
// item's cost isn't accounted for.
export function getInvalidManualItemIds(items: Item[], assignments: Record<string, Assignment>): Set<string> {
  const invalid = new Set<string>();
  items.forEach((item) => {
    const assignment = assignments[item.id];
    if (!assignment || assignment.mode !== 'manual') return;
    const sum = assignment.included.reduce((total, pid) => total + (assignment.percents[pid] || 0), 0);
    if (sum !== 100) invalid.add(item.id);
  });
  return invalid;
}
