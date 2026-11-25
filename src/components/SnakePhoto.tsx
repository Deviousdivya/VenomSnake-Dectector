import { BigFourSnake, bigFourPhotos } from '../data/bigFour';

/** A real photograph of one of the Big Four, with the credit its licence requires. */
export function SnakePhoto({ kind, className, linkCredit = true, hover = false }: { kind: BigFourSnake['id']; className?: string; linkCredit?: boolean; hover?: boolean }) {
  const p = bigFourPhotos[kind];
  return (
    <div className={`relative overflow-hidden bg-paper ${className ?? ''}`}>
      <img
        src={p.src}
        alt={p.alt}
        loading="lazy"
        decoding="async"
        width={960}
        height={640}
        style={{ objectPosition: p.position }}
        className={`h-full w-full object-cover ${hover ? 'transition-transform duration-700 group-hover:scale-105' : ''}`}
      />
      <p className="absolute bottom-1.5 right-2 max-w-[92%] truncate rounded bg-black/50 px-1.5 py-0.5 text-[10px] leading-tight text-white/90">
        Photo: {p.author} ·{' '}
        {linkCredit ? (
          <a className="underline" href={p.page} target="_blank" rel="noopener noreferrer">{p.license}</a>
        ) : (
          p.license
        )}
      </p>
    </div>
  );
}
