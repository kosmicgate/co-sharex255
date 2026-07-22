// Pre-OCR quality gate. When an image is severely blurred, too dark, washed out
// by glare, or too small, we ask the user to retake it rather than let OCR
// hallucinate digits — an invented receipt amount is worse than no amount, and
// sharpening cannot recreate detail that was never captured.
//
// NOTE: these thresholds are heuristic starting points. Blur variance in
// particular is resolution-dependent, so we downscale every image to a fixed
// working size (WORK_LONG_SIDE) before measuring — that keeps a single set of
// thresholds meaningful across a 4MP phone and a 12MP one. Re-tune the
// constants against a real receipt dataset before trusting them hard.

export type QualityReason = 'too_small' | 'blurry' | 'too_dark' | 'glare';

export interface QualityResult {
  acceptable: boolean;
  reasons: QualityReason[];
  blurScore: number;
  medianLuminance: number;
  clippedHighlightRatio: number;
}

// Resolution the metrics are computed at, so thresholds are device-independent.
const WORK_LONG_SIDE = 1000;
// Original long-edge below this can't have captured legible receipt digits.
const MIN_ORIGINAL_LONG_SIDE = 600;

// Example initial thresholds — calibrate against real phone images.
const BLUR_THRESHOLD = 80; // variance-of-Laplacian; below → likely blurred
const DARK_THRESHOLD = 45; // median luminance 0–255; below → likely too dark
const GLARE_THRESHOLD = 0.08; // fraction of near-white pixels; above → excessive glare

const REASON_LABELS: Record<QualityReason, string> = {
  too_small: 'The photo is too small — the text is likely too low-resolution to read.',
  blurry: 'The photo looks blurry.',
  too_dark: 'The photo is too dark.',
  glare: 'There is too much glare or reflection on the receipt.',
};

export function describeQualityReasons(reasons: QualityReason[]): string[] {
  return reasons.map((r) => REASON_LABELS[r]);
}

export async function assessImageQuality(file: File): Promise<QualityResult> {
  const reasons: QualityReason[] = [];
  let blurScore = 0;
  let medianLuminance = 0;
  let clippedHighlightRatio = 0;

  try {
    const bitmap = await createImageBitmap(file);
    const originalLong = Math.max(bitmap.width, bitmap.height);
    if (originalLong < MIN_ORIGINAL_LONG_SIDE) reasons.push('too_small');

    const scale = Math.min(1, WORK_LONG_SIDE / originalLong);
    const w = Math.max(1, Math.round(bitmap.width * scale));
    const h = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      // Can't measure — don't block the user, let OCR try.
      return { acceptable: true, reasons, blurScore, medianLuminance, clippedHighlightRatio };
    }
    ctx.drawImage(bitmap, 0, 0, w, h);
    const { data } = ctx.getImageData(0, 0, w, h);
    const pixelCount = w * h;

    // Grayscale luminance buffer + histogram (for median) + clipped-highlight count.
    const lum = new Float32Array(pixelCount);
    const histogram = new Uint32Array(256);
    let clipped = 0;
    for (let i = 0, p = 0; i < data.length; i += 4, p++) {
      const l = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      lum[p] = l;
      histogram[Math.min(255, Math.round(l))]++;
      if (l >= 250) clipped++;
    }
    clippedHighlightRatio = clipped / pixelCount;

    // Median luminance from the histogram.
    let cumulative = 0;
    for (let v = 0; v < 256; v++) {
      cumulative += histogram[v];
      if (cumulative >= pixelCount / 2) {
        medianLuminance = v;
        break;
      }
    }

    // Blur score = variance of the Laplacian. Sharp images carry strong
    // high-frequency edges (high variance); blurred ones are smooth (low).
    let sum = 0;
    let sumSq = 0;
    let count = 0;
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const idx = y * w + x;
        const lap = 4 * lum[idx] - lum[idx - 1] - lum[idx + 1] - lum[idx - w] - lum[idx + w];
        sum += lap;
        sumSq += lap * lap;
        count++;
      }
    }
    if (count > 0) {
      const mean = sum / count;
      blurScore = sumSq / count - mean * mean;
    }

    if (blurScore < BLUR_THRESHOLD) reasons.push('blurry');
    if (medianLuminance < DARK_THRESHOLD) reasons.push('too_dark');
    if (clippedHighlightRatio > GLARE_THRESHOLD) reasons.push('glare');
  } catch (err) {
    console.error('Image quality assessment failed', err);
    // On failure, don't block — fall through to OCR.
    return { acceptable: true, reasons: [], blurScore, medianLuminance, clippedHighlightRatio };
  }

  return {
    acceptable: reasons.length === 0,
    reasons,
    blurScore,
    medianLuminance,
    clippedHighlightRatio,
  };
}
