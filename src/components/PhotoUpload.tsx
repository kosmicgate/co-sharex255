import { useRef, useState } from 'react';
import { colors } from '../theme';
import { extractReceiptItems } from '../lib/ocr';

export function PhotoUpload({ photoUrl, hasItems, onPhoto, onItemsExtracted }: {
  photoUrl: string | null;
  hasItems: boolean;
  onPhoto: (url: string) => void;
  onItemsExtracted: (items: { name: string; price: number; qty: number }[]) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [reading, setReading] = useState(false);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onPhoto(url);

    if (!hasItems) {
      setReading(true);
      try {
        const items = await extractReceiptItems(file);
        onItemsExtracted(items);
      } catch (err) {
        console.error('OCR failed', err);
      } finally {
        setReading(false);
      }
    }
  };

  return (
    <div style={{ flex: 1, minWidth: 280, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={onFileChange}
        style={{ display: 'none' }}
      />
      {photoUrl && (
        <div style={{ border: `1.5px solid ${colors.ink}`, borderRadius: 8, background: colors.white, overflow: 'hidden' }}>
          <img src={photoUrl} style={{ width: '100%', height: 300, objectFit: 'cover', display: 'block' }} />
        </div>
      )}
      <div
        onClick={() => fileInputRef.current?.click()}
        style={{
          cursor: 'pointer', border: `2px dashed ${colors.ink}`, borderRadius: 8,
          padding: photoUrl ? '16px' : '56px 20px', textAlign: 'center', background: colors.panel,
        }}
      >
        <div style={{ fontSize: 15, color: colors.mutedDark }}>
          {reading ? 'Reading receipt…' : photoUrl ? 'Retake photo' : 'Tap to upload a photo of the bill'}
        </div>
        {!reading && (
          <div style={{ fontSize: 12, color: colors.mutedLight, marginTop: 4 }}>
            JPG or PNG · we'll pull out the line items
          </div>
        )}
      </div>
    </div>
  );
}
