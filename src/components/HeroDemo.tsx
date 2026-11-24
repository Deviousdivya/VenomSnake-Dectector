import { Siren, TriangleAlert } from 'lucide-react';

/** A looping, clearly-labelled sample: the photo is scanned, then the result is revealed. Pure CSS animation. */
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

        {/* the "photo" - an illustration, scanned in a loop */}
        <div className="relative h-56 overflow-hidden bg-gradient-to-b from-[#d7e0c0] to-[#9fb083]">
          <svg viewBox="0 0 400 224" preserveAspectRatio="xMidYMid slice" className="demo-photo absolute inset-0 h-full w-full" aria-hidden>
            <g stroke="#6f8651" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity=".55">
              {[14, 38, 66, 92, 118, 300, 326, 352, 378, 20, 340].map((x, i) => (
                <path key={x} d={`M${x} 224 q${(i % 3) * 3 - 3} -34 ${(i % 5) - 2} -${58 + (i % 4) * 8}`} />
              ))}
            </g>
            <ellipse cx="200" cy="208" rx="124" ry="12" fill="#3d4a2a" opacity=".32" />
            <ellipse cx="200" cy="192" rx="102" ry="22" fill="#7a5530" />
            <ellipse cx="200" cy="171" rx="84" ry="20" fill="#8a6234" />
            <ellipse cx="200" cy="152" rx="63" ry="17" fill="#9a6f3a" />
            <path d="M200 150C200 122 192 102 200 80" stroke="#9a6f3a" strokeWidth="32" strokeLinecap="round" fill="none" />
            <path d="M200 42C132 46 122 108 200 124C278 108 268 46 200 42Z" fill="#a9793f" stroke="#5a3b1a" strokeWidth="3" />
            <g fill="none" stroke="#ecdcb4" strokeWidth="5" strokeLinecap="round" opacity=".85">
              <path d="M178 76q22 10 44 0" /><path d="M172 92q28 12 56 0" /><path d="M182 107q18 8 36 0" />
            </g>
            <ellipse cx="200" cy="32" rx="21" ry="15" fill="#8a6234" stroke="#5a3b1a" strokeWidth="2.5" />
            <circle cx="191" cy="29" r="3" fill="#161008" />
            <circle cx="209" cy="29" r="3" fill="#161008" />
            <path d="M200 46v9m0 0l-4 5m4-5l4 5" stroke="#b3302a" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          </svg>

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
