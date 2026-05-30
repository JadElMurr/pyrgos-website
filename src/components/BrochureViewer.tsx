import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';

export default function BrochureViewer({
  pdf,
  pages,
  onClose,
}: {
  pdf: string;
  pages: number;
  onClose: () => void;
}) {
  const [i, setI] = useState(0);
  const pageUrl = (n: number) => `/images/brochure/page-${String(n + 1).padStart(2, '0')}.jpg`;

  const prev = useCallback(() => setI((p) => (p - 1 + pages) % pages), [pages]);
  const next = useCallback(() => setI((p) => (p + 1) % pages), [pages]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, prev, next]);

  return (
    <div className="fixed inset-0 z-[100] bg-ink/95 backdrop-blur-sm flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 sm:px-8 py-4 text-ivory">
        <span className="font-display text-lg">Palmiras 16 — Brochure</span>
        <div className="flex items-center gap-3">
          <a
            href={pdf}
            download
            className="inline-flex items-center gap-2 text-sm border border-ivory/40 px-4 py-2 hover:bg-ivory hover:text-ink transition-colors"
          >
            <Download className="h-4 w-4" /> Download PDF
          </a>
          <button onClick={onClose} className="p-2 hover:opacity-70 transition-opacity" aria-label="Close">
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Page */}
      <div className="flex-1 flex items-center justify-center px-3 sm:px-16 min-h-0">
        <button onClick={prev} className="absolute left-2 sm:left-6 p-3 text-ivory/70 hover:text-ivory transition-colors" aria-label="Previous page">
          <ChevronLeft className="h-8 w-8" />
        </button>
        <img
          src={pageUrl(i)}
          alt={`Brochure page ${i + 1}`}
          className="max-h-full max-w-full object-contain shadow-2xl bg-white"
        />
        <button onClick={next} className="absolute right-2 sm:right-6 p-3 text-ivory/70 hover:text-ivory transition-colors" aria-label="Next page">
          <ChevronRight className="h-8 w-8" />
        </button>
      </div>

      {/* Thumbnail strip */}
      <div className="px-4 py-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar max-w-5xl mx-auto">
          {Array.from({ length: pages }).map((_, n) => (
            <button
              key={n}
              onClick={() => setI(n)}
              className={`flex-shrink-0 w-20 h-12 overflow-hidden border transition-all ${
                i === n ? 'border-ivory opacity-100' : 'border-transparent opacity-50 hover:opacity-80'
              }`}
            >
              <img src={pageUrl(n)} alt={`Page ${n + 1}`} className="w-full h-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
        <p className="text-center text-ivory/60 text-xs mt-3 tracking-luxe uppercase">
          {i + 1} / {pages}
        </p>
      </div>
    </div>
  );
}
