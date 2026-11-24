import { Siren, TriangleAlert } from 'lucide-react';

/** A looping, clearly-labelled sample: a real cobra photo is scanned, then the result is revealed. Pure CSS animation. */
export function HeroDemo() {
  return (
    <div className="rise rise-3 relative">
      <div aria-hidden className="absolute -inset-6 rounded-[40px] bg-gradient-to-br from-gold-300/35 via-brand-200/40 to-transparent blur-2xl" />
      <article className="card shadow-lift relative overflow-hidden" aria-label="Animated example of an identification result">
        <div className="flex items-center justify-between border-b border-line bg-paper px-5 py-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-muted">Sample result</span>
          <span className="flex items-center gap-1.5 text-xs font-bold text-brand-700">
            <span className="blink h-2 w-2 rounded-full bg-brand-600" aria-hidden /> Demo
          </span>
        </div>

        {/* a real photograph (Wikimedia Commons, CC BY 3.0), scanned in a loop */}
        <div className="relative h-56 overflow-hidden bg-paper">
          <img
            src="/images/indian-cobra.jpg"
            alt="An Indian cobra rearing up on sand"
            width={960}
            height={626}
            className="demo-photo absolute inset-0 h-full w-full object-cover object-[50%_60%]"
            fetchPriority="high"
          />
          <p className="absolute bottom-1.5 right-2 z-10 rounded bg-black/45 px-1.5 py-0.5 text-[10px] text-white/90">
            Photo: Jerzy Strzelecki · <a className="underline" href="https://commons.wikimedia.org/wiki/File:Cobra,_Naja-naja.jpg" target="_blank" rel="noopener noreferrer">CC BY 3.0</a>
          </p>

          <div className="demo-scan absolute inset-0" aria-hidden>
            <div className="scan-beam" />
            {['left-3 top-3 border-l-2 border-t-2', 'right-3 top-3 border-r-2 border-t-2', 'left-3 bottom-3 border-b-2 border-l-2', 'right-3 bottom-3 border-b-2 border-r-2'].map((c) => (
              <span key={c} className={`absolute h-7 w-7 border-gold-300 ${c}`} />
            ))}
          </div>
        </div>

        <div className="grid min-h-[196px] p-6">
          {/* while scanning */}
          <div className="demo-scan space-y-3 [grid-area:1/1]" aria-hidden>
            <div className="skeleton h-8 w-2/3 rounded-lg" />
            <div className="skeleton h-4 w-1/3 rounded-lg" />
            <div className="skeleton mt-5 h-16 w-full rounded-xl" />
          </div>
          {/* the result */}
          <div className="demo-result [grid-area:1/1]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-serif text-[1.9rem] font-medium leading-tight">Indian Cobra</p>
                <p className="italic-serif text-lg text-muted">Naja naja</p>
              </div>
              <span className="badge badge-danger shrink-0">
                <TriangleAlert size={13} aria-hidden /> Venomous
              </span>
            </div>
            <div className="mt-4 rounded-xl border border-danger-600/25 bg-danger-50 p-4">
              <p className="flex items-center gap-2 text-sm font-extrabold text-danger-700">
                <Siren size={16} aria-hidden /> If bitten
              </p>
              <p className="mt-1 text-sm text-ink-2">Call 108 now. Keep the limb still. Don't cut or suck the wound. Nearest hospitals appear here.</p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
