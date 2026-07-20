import { useState } from 'react';
import { PersonCards } from '../components/PersonCard';
import { ShareCard } from '../components/ShareCard';
import { buildShareUrl, saveBill } from '../lib/shareApi';
import type { BillStateApi } from '../state/useBillState';

export function Step4Summary({ bill }: { bill: BillStateApi }) {
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [persisted, setPersisted] = useState(false);
  const [loading, setLoading] = useState(false);

  const generateLink = async () => {
    setLoading(true);
    try {
      const { id, persisted: didPersist } = await saveBill({
        people: bill.people,
        items: bill.items,
        assignments: bill.assignments,
        taxPct: bill.taxPct,
        tipPct: bill.tipPct,
        discountAmt: bill.discountAmt,
      });
      setShareLink(buildShareUrl(id));
      setPersisted(didPersist);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PersonCards people={bill.people} perPersonTotal={bill.totals.perPersonTotal} />
      <ShareCard shareLink={shareLink} persisted={persisted} loading={loading} onGenerate={generateLink} />
    </div>
  );
}
