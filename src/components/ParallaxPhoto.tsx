import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { BigFourSnake, bigFourPhotos } from '../data/bigFour';

/** A real photograph that drifts slowly against the page as you scroll, with the credit its licence requires. */
export function ParallaxPhoto({
  kind,
  className = '',
  strength = 9,
  credit = true,
  rounded = true,
}: {
  kind: BigFourSnake['id'];
  className?: string;
  /** how far the photo travels, as a percentage of its height */
  strength?: number;
  credit?: boolean;
  rounded?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`]);
  const p = bigFourPhotos[kind];

  return (
    <div ref={ref} className={`relative overflow-hidden bg-brand-900 ${rounded ? 'rounded-3xl' : ''} ${className}`}>
      <motion.img
        src={p.lg}
        alt={p.alt}
        loading="lazy"
        decoding="async"
        style={{ y: reduce ? 0 : y, objectPosition: p.position, scale: reduce ? 1 : 1 + (strength * 2) / 100 }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {credit && (
        <p className="absolute bottom-2 right-3 max-w-[90%] truncate rounded bg-black/55 px-2 py-0.5 text-[10px] leading-tight text-white/90 backdrop-blur-sm">
          Photo: {p.author} ·{' '}
          <a className="underline" href={p.page} target="_blank" rel="noopener noreferrer">
            {p.license}
          </a>
        </p>
      )}
    </div>
  );
}
