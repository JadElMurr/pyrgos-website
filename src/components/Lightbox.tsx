import { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

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
  const prev = useCallback(
    () => onIndex((index - 1 + images.length) % images.length),
    [index, images.length, onIndex]
  );
  const next = useCallback(
    () => onIndex((index + 1) % images.length),
    [index, images.length, onIndex]
  );

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
    <div className="fixed inset-0 z-[100] bg-ink/95 backdrop-blur-sm flex flex-col" onClick={onClose}>
      <div className="flex justify-between items-center px-6 py-5 text-ivory/80">
        <span className="text-sm tracking-luxe uppercase">
          {index + 1} / {images.length}
        </span>
        <button onClick={onClose} className="p-2 hover:text-ivory transition-colors" aria-label="Close">
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-16 pb-8" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={prev}
          className="absolute left-3 sm:left-6 p-3 text-ivory/70 hover:text-ivory transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft className="h-8 w-8" />
        </button>
        <img
          src={images[index]}
          alt={`View ${index + 1}`}
          className="max-h-full max-w-full object-contain shadow-2xl"
        />
        <button
          onClick={next}
          className="absolute right-3 sm:right-6 p-3 text-ivory/70 hover:text-ivory transition-colors"
          aria-label="Next"
        >
          <ChevronRight className="h-8 w-8" />
        </button>
      </div>
    </div>
  );
}
