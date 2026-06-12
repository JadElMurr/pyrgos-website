// Compresses an image in the browser before upload: long edge capped at 1920px,
// re-encoded as JPEG. Keeps phone photos to a few hundred KB instead of 5-10 MB.

export type PreparedImage = { b64: string; previewUrl: string; bytes: number };

const MAX_EDGE = 1920;
const QUALITY = 0.85;

export async function prepareImage(file: File): Promise<PreparedImage> {
  const dataUrl: string = await new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(new Error('Could not read file'));
    r.readAsDataURL(file);
  });

  const img: HTMLImageElement = await new Promise((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error('Not a valid image'));
    el.src = dataUrl;
  });

  const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height));
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unavailable');
  ctx.drawImage(img, 0, 0, w, h);

  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Compression failed'))), 'image/jpeg', QUALITY);
  });

  const b64: string = await new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve((r.result as string).split(',')[1]);
    r.onerror = () => reject(new Error('Could not encode image'));
    r.readAsDataURL(blob);
  });

  return { b64, previewUrl: URL.createObjectURL(blob), bytes: blob.size };
}

export function slugifyFilename(name: string): string {
  const base = name.replace(/\.[^.]+$/, '');
  const clean = base.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
  return clean || 'photo';
}
