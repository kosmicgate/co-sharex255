import { useRef, useState } from 'react';
import { colors, fonts } from '../theme';
import { extractReceiptItems } from '../lib/ocr';

export function PhotoUpload({ photoUrl, onPhoto, onItemsExtracted }: {
  photoUrl: string | null;
  onPhoto: (url: string) => void;
  onItemsExtracted: (items: { name: string; price: number; qty: number }[]) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [reading, setReading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // let the same file be picked again
    if (!file) return;
    onPhoto(URL.createObjectURL(file));
    setMessage(null);
    setReading(true);
    try {
      const items = await extractReceiptItems(file);
      onItemsExtracted(items);
      setMessage(items.length
        ? `Added ${items.length} item${items.length === 1 ? '' : 's'} from your receipt. Check the prices above.`
        : "Couldn't read any items from that photo. Try a sharper, straight-on shot, or add items manually.");
    } catch (err) {
      console.error('OCR failed', err);
      setMessage("Couldn't read that photo. Try again, or add items manually.");
    } finally {
      setReading(false);
    }
  };

  return (
    <div style={{
      border: `2px dashed ${colors.ink}`, borderRadius: 8, background: colors.panel, padding: 16,
      display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      <input type="file" accept="image/*" ref={fileInputRef} onChange={onFileChange} style={{ display: 'none' }} />

      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        {photoUrl && (
          <img
            src={photoUrl}
            alt="Receipt"
            style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 6, border: `1.5px solid ${colors.ink}`, flex: 'none' }}
          />
        )}
        <button
          type="button"
          disabled={reading}
          onClick={() => fileInputRef.current?.click()}
          className="upload-btn"
          style={{
            flex: 1, cursor: reading ? 'wait' : 'pointer', padding: '14px 16px',
            background: colors.ink, color: colors.background,
            border: `2px solid ${colors.ink}`, borderRadius: 8, boxShadow: `3px 3px 0 ${colors.teal}`,
            fontFamily: fonts.headline, fontSize: 15, letterSpacing: '0.02em',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, opacity: reading ? 0.7 : 1,
          }}
        >
          <svg width="20" height="18" viewBox="0 0 20 18" aria-hidden="true">
            <path d="M2 5 H6 L7.5 2.5 H12.5 L14 5 H18 V16 H2 Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            <circle cx="10" cy="10.5" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
          </svg>
          {reading ? 'Reading your receipt…' : photoUrl ? 'Upload a different receipt' : 'Upload your receipt'}
        </button>
      </div>

      <div style={{ fontSize: 12, color: message ? colors.mutedDark : colors.mutedLight, textAlign: 'center' }}>
        {message ?? "Snap or pick a photo (JPG or PNG). We'll fill in the items for you."}
      </div>
    </div>
  );
}
