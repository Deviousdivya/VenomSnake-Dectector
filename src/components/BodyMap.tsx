import { KeyboardEvent } from 'react';
import { cn } from '../lib/utils';

interface Region {
  name: string; // sent to the symptom analysis exactly like before ("Left Arm", "Right Leg", ...)
  shape: 'ellipse' | 'rect';
  x: number;
  y: number;
  w: number;
  h: number;
  r?: number;
}

// A front view. "Left"/"Right" are the PATIENT's, so the patient's left is on the viewer's right.
const REGIONS: Region[] = [
  { name: 'Head', shape: 'ellipse', x: 100, y: 38, w: 27, h: 30 },
  { name: 'Torso', shape: 'rect', x: 66, y: 74, w: 68, h: 116, r: 20 },
  { name: 'Right Arm', shape: 'rect', x: 34, y: 80, w: 26, h: 92, r: 13 },
  { name: 'Left Arm', shape: 'rect', x: 140, y: 80, w: 26, h: 92, r: 13 },
  { name: 'Right Hand', shape: 'ellipse', x: 47, y: 190, w: 13, h: 17 },
  { name: 'Left Hand', shape: 'ellipse', x: 153, y: 190, w: 13, h: 17 },
  { name: 'Right Leg', shape: 'rect', x: 70, y: 196, w: 28, h: 134, r: 14 },
  { name: 'Left Leg', shape: 'rect', x: 102, y: 196, w: 28, h: 134, r: 14 },
  { name: 'Right Foot', shape: 'ellipse', x: 84, y: 356, w: 17, h: 25 },
  { name: 'Left Foot', shape: 'ellipse', x: 116, y: 356, w: 17, h: 25 },
];

export function BodyMap({ selected, onSelect }: { selected: string | null; onSelect: (name: string) => void }) {
  const key = (name: string) => (e: KeyboardEvent<SVGGElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(name);
    }
  };

  return (
    <svg viewBox="0 0 200 400" role="group" aria-label="Body diagram. Choose where the bite is." className="mx-auto h-auto w-full max-w-[280px]">
      <text x="6" y="396" fontSize="11" fontWeight="700" fill="#566660">RIGHT</text>
      <text x="194" y="396" fontSize="11" fontWeight="700" fill="#566660" textAnchor="end">LEFT</text>
      {REGIONS.map((r) => {
        const active = selected === r.name;
        const common = {
          className: cn(
            'cursor-pointer outline-none transition-colors duration-150',
            active ? 'fill-danger-600 stroke-danger-700' : 'fill-brand-100 stroke-brand-500 hover:fill-brand-200'
          ),
          strokeWidth: 2,
        };
        return (
          <g
            key={r.name}
            role="button"
            tabIndex={0}
            aria-label={r.name}
            aria-pressed={active}
            onClick={() => onSelect(r.name)}
            onKeyDown={key(r.name)}
            className="group focus-visible:[&>*]:stroke-[#1d5fa8] focus-visible:[&>*]:[stroke-width:4]"
          >
            {r.shape === 'ellipse' ? (
              <ellipse cx={r.x} cy={r.y} rx={r.w} ry={r.h} {...common} />
            ) : (
              <rect x={r.x} y={r.y} width={r.w} height={r.h} rx={r.r} {...common} />
            )}
          </g>
        );
      })}
    </svg>
  );
}
