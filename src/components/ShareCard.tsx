import { useState } from 'react';
import { colors, fonts } from '../theme';

export function ShareCard({ shareLink, persisted, loading, onGenerate }: {
  shareLink: string | null;
  persisted: boolean;
  loading: boolean;
  onGenerate: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!shareLink) return;
    try {
      await navigator.clipboard.writeText(shareLink);
    } catch {
      // clipboard API unavailable — link is still visible/selectable in the field
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div style={{
      background: colors.white, border: `1.5px solid ${colors.ink}`, borderRadius: 8, padding: 22,
      display: 'flex', flexDirection: 'column', gap: 14,
    }}>
      <div style={{ fontFamily: fonts.mono, fontSize: 12, letterSpacing: '0.08em', color: colors.mutedLight }}>SHARE THIS BILL</div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <input
          value={loading ? 'Generating link…' : shareLink ?? ''}
          readOnly
          onFocus={(e) => e.target.select()}
          style={{
            flex: 1, minWidth: 220, border: `1.5px solid ${colors.ink}`, borderRadius: 6, padding: '10px 12px',
            fontFamily: fonts.mono, fontSize: 13, background: colors.background,
          }}
        />
        {shareLink ? (
          <div
            onClick={copy}
            style={{
              cursor: 'pointer', border: `1.5px solid ${colors.ink}`, borderRadius: 6, padding: '10px 18px',
              background: colors.ink, color: colors.background, fontSize: 13, fontWeight: 600,
            }}
          >
            {copied ? 'Copied!' : 'Copy link'}
          </div>
        ) : (
          <div
            onClick={onGenerate}
            style={{
              cursor: 'pointer', border: `1.5px solid ${colors.ink}`, borderRadius: 6, padding: '10px 18px',
              background: colors.ink, color: colors.background, fontSize: 13, fontWeight: 600,
            }}
          >
            {loading ? 'Generating…' : 'Generate link'}
          </div>
        )}
      </div>
      {shareLink && !persisted && (
        <div style={{ fontSize: 12, color: colors.mutedLight }}>
          Supabase isn't connected yet, so this link won't load on another device — connect it in .env to make sharing real.
        </div>
      )}
    </div>
  );
}
