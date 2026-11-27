import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, MotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowLeft, ArrowRight, TriangleAlert } from 'lucide-react';
import { bigFour, bigFourPhotos, BigFourSnake } from '../data/bigFour';

const pad = (n: number) => String(n).padStart(2, '0');

function useWide() {
  const query = '(min-width: 1024px)';
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const m = window.matchMedia(query);
    const on = () => setWide(m.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
  return wide;
}

function Credit({ s, className = '' }: { s: BigFourSnake; className?: string }) {
  const p = bigFourPhotos[s.id];
  return (
    <p className={`rounded bg-black/55 px-2 py-0.5 text-[10px] leading-tight text-white/90 backdrop-blur-sm ${className}`}>
      Photo: {p.author} ·{' '}
      <a className="underline" href={p.page} target="_blank" rel="noopener noreferrer">
        {p.license}
      </a>
    </p>
  );
}

/* ------------------------------------------------------------------
   Desktop: the section pins to the screen while you scroll, and the four snakes slide past sideways.
------------------------------------------------------------------- */
function Panel({ s, i, n, progress }: { s: BigFourSnake; i: number; n: number; progress: MotionValue<number> }) {
  const p = bigFourPhotos[s.id];
  const local = useTransform(progress, (v) => v * (n - 1) - i); // 0 when this snake is centred on screen
  const textOpacity = useTransform(local, (l) => Math.max(0, 1 - Math.abs(l) * 1.7));
  const textX = useTransform(local, (l) => l * -160);
  const imgX = useTransform(local, (l) => `${l * 5}%`);
  const imgScale = useTransform(local, (l) => 1.12 - Math.min(1, Math.abs(l)) * 0.05);

  return (
    <article className="relative h-screen w-screen shrink-0 overflow-hidden" aria-label={s.name}>
      <motion.img
        src={p.lg}
        alt={p.alt}
        loading={i === 0 ? 'eager' : 'lazy'}
        decoding="async"
        style={{ x: imgX, scale: imgScale, objectPosition: p.position }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-brand-950 via-brand-950/70 to-brand-950/10" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-brand-950/80 via-transparent to-brand-950/30" />

      <motion.div style={{ opacity: textOpacity, x: textX }} className="container-wide relative z-10 flex h-full flex-col justify-end pb-28 pt-28">
        <p className="font-serif text-xl text-gold-300">
          {pad(i + 1)} <span className="text-white/40">/ {pad(n)}</span>
        </p>
        <h3 className="mt-3 max-w-3xl text-[5.2rem] font-medium leading-[0.95] !text-white xl:text-[6.4rem]">{s.name}</h3>
        <p className="italic-serif mt-3 text-2xl text-white/70">{s.scientific}</p>
        <p className="mt-5">
          <span className="badge border border-danger-100/30 bg-danger-600/25 text-danger-100">
            <TriangleAlert size={13} aria-hidden /> {s.venomShort}
          </span>
        </p>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85">{s.look}</p>
        <p className="mt-5 max-w-xl rounded-xl border border-gold-300/40 bg-black/30 p-4 text-[15px] leading-relaxed text-white/90 backdrop-blur">
          <strong className="text-gold-300">Remember:</strong> {s.warning}
        </p>
        <Link to={`/big-four#${s.id}`} className="mt-7 inline-flex w-fit items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-gold-300 no-underline hover:text-white">
          Read the field guide <ArrowRight size={16} aria-hidden />
        </Link>
      </motion.div>
      <Credit s={s} className="absolute bottom-5 right-6 z-10" />
    </article>
  );
}

function Pinned() {
  const ref = useRef<HTMLDivElement>(null);
  const n = bigFour.length;
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], ['0vw', `-${(n - 1) * 100}vw`]);
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', (v) => setActive(Math.min(n - 1, Math.max(0, Math.round(v * (n - 1))))));

  return (
    <div ref={ref} style={{ height: `${n * 100}vh` }} className="relative bg-brand-950">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div style={{ x }} className="flex h-full w-max will-change-transform">
          {bigFour.map((s, i) => (
            <Panel key={s.id} s={s} i={i} n={n} progress={scrollYProgress} />
          ))}
        </motion.div>

        {/* progress rail */}
        <div className="pointer-events-none absolute inset-x-0 bottom-8 z-20">
          <div className="container-wide flex items-center gap-4">
            <ol className="flex flex-1 gap-3" aria-hidden>
              {bigFour.map((s, i) => (
                <li key={s.id} className="flex-1">
                  <div className="h-px w-full bg-white/25">
                    <div className="h-px bg-gold-300 transition-all duration-700" style={{ width: i <= active ? '100%' : '0%' }} />
                  </div>
                  <p className={`mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors ${i === active ? 'text-gold-300' : 'text-white/45'}`}>
                    {pad(i + 1)} · {s.name}
                  </p>
                </li>
              ))}
            </ol>
            <p className="hidden shrink-0 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55 xl:block">Keep scrolling</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Phones, tablets and reduced motion: a swipeable slider with arrows.
------------------------------------------------------------------- */
function Slider() {
  const ref = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  const go = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const card = el.children[0] as HTMLElement | undefined;
    el.scrollBy({ left: dir * ((card?.clientWidth ?? el.clientWidth * 0.8) + 16), behavior: 'smooth' });
  };

  return (
    <div className="bg-brand-950 py-14 sm:py-20">
      <ul
        ref={ref}
        onScroll={(e) => {
          const el = e.currentTarget;
          const card = el.children[0] as HTMLElement | undefined;
          if (card) setActive(Math.round(el.scrollLeft / (card.clientWidth + 16)));
        }}
        className="snap-x-slider flex gap-4 overflow-x-auto px-5 sm:px-8"
        aria-label="The Big Four venomous snakes"
      >
        {bigFour.map((s, i) => {
          const p = bigFourPhotos[s.id];
          return (
            <li key={s.id} className="w-[86%] shrink-0 overflow-hidden rounded-3xl bg-brand-900 ring-1 ring-white/10 sm:w-[58%]">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={p.lg} alt={p.alt} loading={i === 0 ? 'eager' : 'lazy'} decoding="async" style={{ objectPosition: p.position }} className="h-full w-full object-cover" />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-brand-900 via-transparent to-transparent" />
                <p className="absolute left-4 top-3 font-serif text-lg text-gold-300">
                  {pad(i + 1)} <span className="text-white/50">/ {pad(bigFour.length)}</span>
                </p>
                <Credit s={s} className="absolute bottom-2 right-2" />
              </div>
              <div className="p-6">
                <h3 className="text-3xl !text-white">{s.name}</h3>
                <p className="italic-serif mt-1 text-white/65">{s.scientific}</p>
                <p className="mt-3">
                  <span className="badge border border-danger-100/30 bg-danger-600/25 text-danger-100">
                    <TriangleAlert size={12} aria-hidden /> {s.venomShort}
                  </span>
                </p>
                <p className="mt-4 text-[15px] leading-relaxed text-white/80">{s.look}</p>
                <Link to={`/big-four#${s.id}`} className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-gold-300 no-underline">
                  Field guide <ArrowRight size={14} aria-hidden />
                </Link>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="container-x mt-6 flex items-center justify-between">
        <div className="flex gap-2" aria-hidden>
          {bigFour.map((s, i) => (
            <span key={s.id} className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? 'w-8 bg-gold-300' : 'w-3 bg-white/30'}`} />
          ))}
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => go(-1)} aria-label="Previous snake" className="grid h-11 w-11 place-items-center rounded-full border border-white/25 text-white transition hover:border-gold-300 hover:text-gold-300">
            <ArrowLeft size={18} />
          </button>
          <button type="button" onClick={() => go(1)} aria-label="Next snake" className="grid h-11 w-11 place-items-center rounded-full border border-white/25 text-white transition hover:border-gold-300 hover:text-gold-300">
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

/** The four most dangerous snakes in India, sliding past full-screen. Falls back to a swipeable slider on small screens. */
export function BigFourShowcase() {
  const wide = useWide();
  const reduce = useReducedMotion();
  return wide && !reduce ? <Pinned /> : <Slider />;
}
