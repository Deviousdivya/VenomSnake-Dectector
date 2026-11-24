/** A decorative snake that draws itself across the hero background and then reveals its head. */
export function SnakeLine({ className }: { className?: string }) {
  const d = 'M560 20C430 60 600 170 430 215S120 270 290 345 590 430 360 505 90 585 250 676';
  return (
    <svg viewBox="0 0 640 760" className={className} fill="none" aria-hidden>
      <defs>
        <linearGradient id="snk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0f6149" />
          <stop offset="1" stopColor="#c29a42" />
        </linearGradient>
        <pattern id="snk-scales" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="8" height="8" fill="#000" opacity=".22" />
          <rect x="8" y="8" width="8" height="8" fill="#000" opacity=".22" />
        </pattern>
      </defs>
      {/* body */}
      <path d={d} pathLength={1} stroke="url(#snk)" strokeWidth="30" strokeLinecap="round" className="draw-path" style={{ ['--len' as string]: 1 }} />
      {/* diamond scales along the body */}
      <path d={d} pathLength={1} stroke="url(#snk-scales)" strokeWidth="30" strokeLinecap="round" className="draw-path" style={{ ['--len' as string]: 1 }} />
      {/* head, appears when the body has finished drawing */}
      <g className="rise" style={{ animationDelay: '3.3s' }}>
        <ellipse cx="250" cy="700" rx="26" ry="34" fill="#c29a42" />
        <ellipse cx="250" cy="700" rx="26" ry="34" fill="url(#snk-scales)" />
        <circle cx="238" cy="708" r="4" fill="#0b1f18" />
        <circle cx="262" cy="708" r="4" fill="#0b1f18" />
        <path d="M250 734v16m0 0l-6 8m6-8l6 8" stroke="#b3302a" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  );
}
