import { useState } from 'react';
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import ImageFrame from './ImageFrame';
import Lightbox from './Lightbox';
import { useSwipe } from '../hooks/useSwipe';

type Badge = { text: string; tone: 'ink' | 'bronze' };

export default function Gallery({
  images,
  alt,
  aspectClass = 'aspect-[4/3]',
  label = 'View gallery',
  grayscale = false,
  badge,
}: {
  images: string[];
  alt: string;
  aspectClass?: string;
  label?: string;
  grayscale?: boolean;
  badge?: Badge;
}) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  if (!images.length) return null;

  const multi = images.length > 1;
  const prev = () => setActive((i) => (i - 1 + images.length) % images.length);
  const next = () => setActive((i) => (i + 1) % images.length);
  const swipe = useSwipe(next, prev);

  const arrow =
    'absolute z-20 top-1/2 -translate-y-1/2 h-11 w-11 inline-flex items-center justify-center rounded-full bg-ink/40 text-ivory backdrop-blur-sm hover:bg-ink/75 active:bg-ink/80 transition-colors';

  return (
    <div>
      <div className={`group relative w-full ${aspectClass} overflow-hidden select-none`} {...swipe}>
        <button onClick={() => setOpen(true)} className="block w-full h-full" aria-label="Open image viewer">
          <ImageFrame src={images[active]} alt={alt} className="w-full h-full" eager imgClassName={grayscale ? 'grayscale-[25%]' : ''} />
        </button>

        {badge && (
          <span className={`absolute z-20 top-5 left-5 text-ivory text-xs tracking-luxe uppercase px-4 py-2 ${badge.tone === 'bronze' ? 'bg-bronze' : 'bg-ink'}`}>
            {badge.text}
          </span>
        )}

        {multi && (
          <>
            <button onClick={prev} aria-label="Previous image" className={`${arrow} left-3 sm:left-4`}>
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={next} aria-label="Next image" className={`${arrow} right-3 sm:right-4`}>
              <ChevronRight className="h-5 w-5" />
            </button>
            <span className="absolute z-20 bottom-4 left-1/2 -translate-x-1/2 bg-ink/55 text-ivory text-[11px] tracking-wide px-3 py-1 rounded-full backdrop-blur-sm">
              {active + 1} / {images.length}
            </span>
          </>
        )}

        <span className="absolute z-20 bottom-4 right-4 hidden sm:inline-flex items-center gap-2 bg-ink/70 text-ivory text-xs tracking-wide px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <Expand className="h-4 w-4" /> {label}
        </span>
      </div>

      {multi && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mt-3">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
              className={`aspect-[4/3] overflow-hidden transition-all ${active === i ? 'ring-2 ring-bronze' : 'opacity-60 hover:opacity-100'}`}
            >
              <ImageFrame src={img} alt={`${alt} ${i + 1}`} className="w-full h-full" blur={false} />
            </button>
          ))}
        </div>
      )}

      {open && <Lightbox images={images} index={active} onClose={() => setOpen(false)} onIndex={setActive} />}
    </div>
  );
}
