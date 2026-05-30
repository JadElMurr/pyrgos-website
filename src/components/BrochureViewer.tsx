import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { useSwipe } from '../hooks/useSwipe';

export default function BrochureViewer({
  pdf,
  pages,
  dir = '/images/brochure',
  title = 'Brochure',
  onClose,
}: {
  pdf: string;
  pages: number;
  dir?: string;
  title?: string;
  onClose: () => void;
}) {
  const [i, setI] = useState(0);
  const pageUrl = (n: number) => `${dir}/page-${String(n + 1).padStart(2, '0')}.jpg`;

  const prev = useCallback(() => setI((p) => (p - 1 + pages) % pages), [pages]);
  const next = useCallback(() => setI((p) => (p + 1) % pages), [pages]);
  const swipe = useSwipe(next, prev);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, prev, next]);

  const arrow =
    'absolute top-1/2 -translate-y-1/2 h-12 w-12 inline-flex items-center justify-center rounded-full bg-ivory/10 text-ivory backdrop-blur-sm hover:bg-ivory/25 transition-colors';

  return createPortal(
    <div className="fixed inset-0 z-[100] bg-ink/95 backdrop-blur-sm flex flex-col" role="dialog" aria-modal="true">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 sm:px-8 py-4 text-ivory flex-shrink-0">
        <span className="font-display text-lg truncate pr-3">{title}</span>
        <div className="flex items-center gap-3 flex-shrink-0">
          <a
            href={pdf}
            download
            className="inline-flex items-center gap-2 text-sm border border-ivory/40 px-4 py-2 hover:bg-ivory hover:text-ink transition-colors"
          >
            <Download className="h-4 w-4" /> <span className="hidden sm:inline">Download PDF</span><span className="sm:hidden">PDF</span>
          </a>
          <button onClick={onClose} className="p-2 -m-1 hover:opacity-70 transition-opacity" aria-label="Close">
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Page */}
      <div className="relative flex-1 flex items-center justify-center px-3 sm:px-24 min-h-0 select-none" {...swipe}>
        <button onClick={prev} className={`${arrow} left-3 sm:left-6`} aria-label="Previous page">
          <ChevronLeft className="h-7 w-7" />
        </button>
        <img
          src={pageUrl(i)}
          alt={`Brochure page ${i + 1}`}
          className="max-h-full max-w-full object-contain shadow-2xl bg-white"
        />
        <button onClick={next} className={`${arrow} right-3 sm:right-6`} aria-label="Next page">
          <ChevronRight className="h-7 w-7" />
        </button>
      </div>

      {/* Thumbnail strip */}
      <div className="px-4 py-4 flex-shrink-0">
        <div className="flex gap-2 overflow-x-auto no-scrollbar max-w-5xl mx-auto">
          {Array.from({ length: pages }).map((_, n) => (
            <button
              key={n}
              onClick={() => setI(n)}
              aria-label={`Go to page ${n + 1}`}
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
    </div>,
    document.body
  );
}
