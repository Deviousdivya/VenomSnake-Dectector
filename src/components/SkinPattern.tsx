import { useId } from 'react';
import { BigFourSnake } from '../data/bigFour';

/** Abstract illustration of each snake's skin pattern - a visual identity for the cards (not a photograph). */
export function SkinPattern({ kind, className }: { kind: BigFourSnake['id']; className?: string }) {
  const uid = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 320 160" className={className} role="img" aria-label={`${kind} skin pattern illustration`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id={`sc-${uid}`} width="22" height="18" patternUnits="userSpaceOnUse">
          <path d="M0 9a11 9 0 0 1 22 0M-11 18a11 9 0 0 1 22 0M11 18a11 9 0 0 1 22 0" fill="none" stroke="#000" strokeOpacity=".13" />
        </pattern>
        <linearGradient id={`sh-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".18" />
          <stop offset=".5" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".22" />
        </linearGradient>
      </defs>

      {kind === 'cobra' && (
        <>
          <rect width="320" height="160" fill="#8a6234" />
          <g fill="#6d4a24" opacity=".45">{[0, 1, 2, 3].map((i) => <rect key={i} x={i * 90 - 10} y="0" width="46" height="160" />)}</g>
          {/* the cobra's "spectacle" hood mark, as a repeating motif */}
          {[0, 1, 2].map((row) =>
            Array.from({ length: 5 }, (_, i) => (
              <g key={`${row}-${i}`} transform={`translate(${34 + i * 64 + (row % 2) * 32} ${30 + row * 50})`} fill="#f2e7cf" stroke="#3b2812" strokeWidth="2.5">
                <circle cx="-9" r="9" /><circle cx="9" r="9" /><path d="M-3 0h6" fill="none" />
              </g>
            ))
          )}
        </>
      )}
      {kind === 'krait' && (
        <>
          <rect width="320" height="160" fill="#101b27" />
          {Array.from({ length: 9 }, (_, i) => <rect key={i} x={20 + i * 36} y="0" width="9" height="160" fill="#f3f1ea" opacity=".9" />)}
        </>
      )}
      {kind === 'russell' && (
        <>
          <rect width="320" height="160" fill="#c79a52" />
          {[0, 1, 2].map((row) =>
            Array.from({ length: 5 }, (_, i) => (
              <ellipse key={`${row}-${i}`} cx={30 + i * 64 + (row % 2) * 30} cy={28 + row * 52} rx="24" ry="17" fill="#6a3f1c" stroke="#f6ecd5" strokeWidth="4" />
            ))
          )}
        </>
      )}
      {kind === 'sawscaled' && (
        <>
          <rect width="320" height="160" fill="#d9c49b" />
          {Array.from({ length: 6 }, (_, i) => (
            <path key={i} d={`M${i * 58 - 10} 150 l24 -66 l24 66`} fill="none" stroke="#7a5a35" strokeWidth="9" strokeLinejoin="round" opacity=".85" />
          ))}
          {Array.from({ length: 5 }, (_, i) => <ellipse key={i} cx={34 + i * 62} cy="34" rx="20" ry="11" fill="#fff6e0" opacity=".85" />)}
        </>
      )}

      <rect width="320" height="160" fill={`url(#sc-${uid})`} />
      <rect width="320" height="160" fill={`url(#sh-${uid})`} />
    </svg>
  );
}
