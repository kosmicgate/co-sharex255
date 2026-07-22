// Resolution policy: Tesseract needs glyphs at a reasonable pixel size, and
// upscaling genuinely helps small print — but resizing is lossy, so we do it
// once and only when needed. Upscale narrow receipts up to a minimum legible
// width; downscale only images whose long side is very large. A receipt that
// already sits in the good range is left untouched (no resample at all).
const MIN_RECEIPT_WIDTH = 1400;
const MAX_LONG_SIDE = 2800;

// Grayscale + contrast-stretch a receipt photo before handing it to Tesseract.
// Real phone photos are often dim/low-contrast (indoor lighting, glare, thermal
// paper); normalizing the luminance range gives Tesseract's internal
// thresholding a much cleaner signal to work with.
export async function preprocessReceiptImage(file: File): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file);
    const srcW = bitmap.width;
    const srcH = bitmap.height;
    const longSide = Math.max(srcW, srcH);

    let scale = 1;
    // Upscale when the receipt is narrower than the minimum legible width.
    if (srcW < MIN_RECEIPT_WIDTH) scale = MIN_RECEIPT_WIDTH / srcW;
    // Cap the long side — this also downscales very large photos. Clamping here
    // wins over the upscale above, so an already-tall receipt is never blown up
    // past the cap.
    if (longSide * scale > MAX_LONG_SIDE) scale = MAX_LONG_SIDE / longSide;

    const width = Math.max(1, Math.round(srcW * scale));
    const height = Math.max(1, Math.round(srcH * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return file;

    // Request the best resampling the browser offers (bicubic-class) — matters
    // most when upscaling small print.
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(bitmap, 0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, width, height);
    const pixels = imageData.data;

    const luminance = new Float32Array(width * height);
    let min = 255;
    let max = 0;
    for (let i = 0, p = 0; i < pixels.length; i += 4, p++) {
      const l = 0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2];
      luminance[p] = l;
      if (l < min) min = l;
      if (l > max) max = l;
    }

    const range = Math.max(max - min, 1);
    for (let i = 0, p = 0; i < pixels.length; i += 4, p++) {
      const stretched = ((luminance[p] - min) / range) * 255;
      pixels[i] = pixels[i + 1] = pixels[i + 2] = stretched;
    }
    ctx.putImageData(imageData, 0, 0);

    const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (!blob) return file;
    return new File([blob], 'receipt-preprocessed.png', { type: 'image/png' });
  } catch (err) {
    console.error('Image preprocessing failed, using original photo', err);
    return file;
  }
}
