import { createElement, CSSProperties, MouseEvent, ReactNode, useEffect, useRef, useState } from 'react';
import { cn } from '../lib/utils';

type Tag = 'div' | 'li' | 'section' | 'article' | 'p' | 'ul' | 'ol' | 'header';

/** Fades and lifts its content into view the first time it scrolls onscreen. Content is always visible without JavaScript or with reduced motion. */
export function Reveal({
  children,
  delay = 0,
  className,
  as = 'div',
  onMouseMove,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: Tag;
  onMouseMove?: (e: MouseEvent<HTMLElement>) => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return createElement(
    as,
    { ref, onMouseMove, className: cn('reveal', shown && 'in', className), style: { '--d': `${delay}ms` } as CSSProperties },
    children
  );
}

/** onMouseMove handler that feeds the `.spotlight` hover glow with the pointer position. */
export function trackSpotlight(e: MouseEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
}
