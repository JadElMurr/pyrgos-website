import { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSwipe } from '../hooks/useSwipe';

export default function Lightbox({
  images,
  index,
  onClose,
  onIndex,
}: {
  images: string[];
  index: number;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const multi = images.length > 1;
  const prev = useCallback(
    () => onIndex((index - 1 + images.length) % images.length),
    [index, images.length, onIndex]
  );
  const next = useCallback(
    () => onIndex((index + 1) % images.length),
    [index, images.length, onIndex]
  );
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
    'absolute top-1/2 -translate-y-1/2 h-12 w-12 inline-flex items-center justify-center rounded-full bg-ivory/10 text-ivory backdrop-blur-sm hover:bg-ivory/25 active:bg-ivory/30 transition-colors';

  // Portal to body so the overlay is never trapped inside a transformed ancestor (Reveal).
  return createPortal(
    <div
      className="fixed inset-0 z-[100] bg-ink/95 backdrop-blur-sm flex flex-col"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="flex justify-between items-center px-6 py-5 text-ivory/80 flex-shrink-0">
        <span className="text-sm tracking-luxe uppercase">{multi ? `${index + 1} / ${images.length}` : ''}</span>
        <button onClick={onClose} className="p-2 -m-2 hover:text-ivory transition-colors" aria-label="Close">
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Clicks on the empty area close; clicks on the image or arrows do not. */}
      <div className="relative flex-1 flex items-center justify-center px-4 sm:px-24 pb-8 min-h-0 select-none" {...swipe}>
        {multi && (
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className={`${arrow} left-3 sm:left-6`}
            aria-label="Previous"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>
        )}
        <img
          src={images[index]}
          alt={`View ${index + 1}`}
          onClick={(e) => e.stopPropagation()}
          className="max-h-full max-w-full object-contain shadow-2xl"
        />
        {multi && (
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className={`${arrow} right-3 sm:right-6`}
            aria-label="Next"
          >
            <ChevronRight className="h-7 w-7" />
          </button>
        )}
      </div>

      {multi && (
        <p className="sm:hidden text-center text-ivory/50 text-xs pb-5 tracking-wide flex-shrink-0">
          Swipe, or tap outside to close
        </p>
      )}
    </div>,
    document.body
  );
}
