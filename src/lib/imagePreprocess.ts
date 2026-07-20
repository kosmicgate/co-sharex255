// Grayscale + contrast-stretch a receipt photo before handing it to Tesseract.
// Real phone photos are often dim/low-contrast (indoor lighting, glare, thermal
// paper); normalizing the luminance range gives Tesseract's internal
// thresholding a much cleaner signal to work with. Also normalizes resolution
// so both very small and very large photos land in a size Tesseract handles well.
export async function preprocessReceiptImage(file: File): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file);
    const targetMax = 1800;
    const longSide = Math.max(bitmap.width, bitmap.height);
    const scale = targetMax / longSide;
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;

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
