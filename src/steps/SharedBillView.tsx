import { useEffect, useState } from 'react';
import { colors, fonts } from '../theme';
import { Header } from '../components/Header';
import { PersonCards } from '../components/PersonCard';
import { fmt } from '../lib/currency';
import { loadBill } from '../lib/shareApi';
import { computeTotals } from '../state/computeTotals';
import type { BillData } from '../state/types';

export function SharedBillView({ id }: { id: string }) {
  const [bill, setBill] = useState<BillData | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;
    loadBill(id).then((data) => {
      if (cancelled) return;
      if (data) {
        setBill(data);
        setStatus('ready');
      } else {
        setStatus('error');
      }
    });
    return () => { cancelled = true; };
  }, [id]);

  return (
    <div style={{
      minHeight: '100vh', background: colors.background, fontFamily: fonts.body, color: colors.ink,
      padding: '36px 6vw 80px',
    }}>
      <Header stepNum={4} />
      <div style={{ textAlign: 'center', marginBottom: 26 }}>
        <h1 style={{ fontFamily: fonts.headline, fontSize: 'clamp(32px, 5vw, 56px)', margin: 0, letterSpacing: '-0.01em' }}>
          SHARED BILL
        </h1>
        <p style={{ margin: '10px 0 0', color: colors.mutedDark, fontSize: 16 }}>
          {status === 'ready' ? "Here's what everyone owes." : ' '}
        </p>
      </div>

      <div style={{ maxWidth: 1080, margin: '0 auto', width: '100%' }}>
        {status === 'loading' && <div style={{ textAlign: 'center', color: colors.mutedDark }}>Loading bill…</div>}
        {status === 'error' && (
          <div style={{ textAlign: 'center', color: colors.mutedDark }}>
            This bill link isn't available. It may have expired, or sharing isn't connected yet.
          </div>
        )}
        {status === 'ready' && bill && (() => {
          const totals = computeTotals(bill);
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <PersonCards people={bill.people} perPersonTotal={totals.perPersonTotal} />
              <div style={{
                background: colors.white, border: `1.5px solid ${colors.ink}`, borderRadius: 8, padding: 22,
                display: 'flex', flexDirection: 'column', gap: 4, fontFamily: fonts.mono, fontSize: 13,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: colors.mutedDark }}>
                  <span>Subtotal</span><span>{fmt(totals.subtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: colors.mutedDark }}>
                  <span>Tax + Tip</span><span>{fmt(totals.taxAmt + totals.tipAmt)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: colors.mutedDark }}>
                  <span>Discount</span><span>-{fmt(totals.discountAmt)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700, color: colors.teal, marginTop: 4 }}>
                  <span>Total</span><span>{fmt(totals.grandTotal)}</span>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
