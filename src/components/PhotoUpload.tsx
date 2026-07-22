import { useRef, useState } from 'react';
import { colors, fonts } from '../theme';
import { extractReceiptItems } from '../lib/ocr';
import { assessImageQuality, describeQualityReasons, type QualityResult } from '../lib/imageQuality';

export function PhotoUpload({ photoUrl, hasItems, onPhoto, onItemsExtracted }: {
  photoUrl: string | null;
  hasItems: boolean;
  onPhoto: (url: string) => void;
  onItemsExtracted: (items: { name: string; price: number; qty: number }[]) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastFileRef = useRef<File | null>(null);
  const [reading, setReading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [quality, setQuality] = useState<QualityResult | null>(null);

  const runOcr = async (file: File) => {
    if (hasItems) return;
    setReading(true);
    try {
      const items = await extractReceiptItems(file);
      onItemsExtracted(items);
    } catch (err) {
      console.error('OCR failed', err);
    } finally {
      setReading(false);
    }
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    lastFileRef.current = file;
    onPhoto(URL.createObjectURL(file));
    setQuality(null);

    setChecking(true);
    let result: QualityResult;
    try {
      result = await assessImageQuality(file);
    } finally {
      setChecking(false);
    }

    if (result.acceptable) {
      await runOcr(file);
    } else {
      // Poor image — surface why and let the user retake or override.
      setQuality(result);
    }
  };

  const scanAnyway = async () => {
    const file = lastFileRef.current;
    if (!file) return;
    setQuality(null);
    await runOcr(file);
  };

  const dropzoneLabel = checking
    ? 'Checking photo quality…'
    : reading
      ? 'Reading receipt…'
      : photoUrl
        ? 'Retake photo'
        : 'Tap to upload a photo of the bill';

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

      {quality && !quality.acceptable && (
        <div style={{
          border: `1.5px solid ${colors.red}`, borderRadius: 8, background: colors.white,
          padding: 16, display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          <div style={{ fontFamily: fonts.mono, fontSize: 12, letterSpacing: '0.06em', color: colors.red }}>
            THIS PHOTO MAY BE HARD TO READ
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: colors.mutedDark, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {describeQualityReasons(quality.reasons).map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
          <div style={{ fontSize: 12, color: colors.mutedLight }}>
            Retake it flat and in good light, filling the frame — we can't recover digits the camera didn't capture.
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                cursor: 'pointer', border: `1.5px solid ${colors.ink}`, borderRadius: 6, padding: '8px 16px',
                fontSize: 13, fontWeight: 600, background: colors.ink, color: colors.background,
              }}
            >
              Retake photo
            </div>
            <div
              onClick={scanAnyway}
              style={{
                cursor: 'pointer', border: `1.5px solid ${colors.ink}`, borderRadius: 6, padding: '8px 16px',
                fontSize: 13, fontWeight: 600, background: colors.white, color: colors.ink,
              }}
            >
              Scan anyway
            </div>
          </div>
        </div>
      )}

      <div
        onClick={() => fileInputRef.current?.click()}
        style={{
          cursor: 'pointer', border: `2px dashed ${colors.ink}`, borderRadius: 8,
          padding: photoUrl ? '16px' : '56px 20px', textAlign: 'center', background: colors.panel,
        }}
      >
        <div style={{ fontSize: 15, color: colors.mutedDark }}>{dropzoneLabel}</div>
        {!checking && !reading && (
          <div style={{ fontSize: 12, color: colors.mutedLight, marginTop: 4 }}>
            JPG or PNG · we'll pull out the line items
          </div>
        )}
      </div>
    </div>
  );
}
