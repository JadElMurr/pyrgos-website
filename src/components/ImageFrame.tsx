// Shows an image IN FULL (never cropped) by containing it, and fills any
// leftover space with a soft, blurred copy of the same image. This keeps
// every image — portrait building renders, landscape interiors, floor plans —
// fully visible while looking intentional and premium across the site.

type Props = {
  src: string;
  alt: string;
  className?: string; // container classes — set the aspect ratio here
  fit?: 'contain' | 'cover';
  blur?: boolean;
  imgClassName?: string; // extra classes on the sharp image (e.g. hover/grayscale)
  eager?: boolean;
};

export default function ImageFrame({
  src,
  alt,
  className = '',
  fit = 'contain',
  blur = true,
  imgClassName = '',
  eager = false,
}: Props) {
  return (
    <div className={`relative overflow-hidden bg-paper ${className}`}>
      {blur && fit === 'contain' && (
        <img
          src={src}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-60 select-none pointer-events-none"
        />
      )}
      <img
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        className={`relative z-10 w-full h-full ${fit === 'cover' ? 'object-cover' : 'object-contain'} ${imgClassName}`}
      />
    </div>
  );
}
