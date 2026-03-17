'use client';
import { useEffect, useRef, useState } from 'react';

interface SignalDot {
  id: string;
  cx: number;
  cy: number;
  grade: 'PLATINUM' | 'GOLD' | 'SILVER';
  label: string;
}

const INITIAL_DOTS: SignalDot[] = [
  { id: '1', cx: 515, cy: 178, grade: 'PLATINUM', label: 'Microsoft · UAE · $850M' },
  { id: '2', cx: 527, cy: 185, grade: 'GOLD',     label: 'AWS · Saudi Arabia · $5.3B' },
  { id: '3', cx: 620, cy: 195, grade: 'GOLD',     label: 'Samsung · India · $2.1B' },
  { id: '4', cx: 690, cy: 175, grade: 'PLATINUM', label: 'Samsung · Vietnam · $2.8B' },
  { id: '5', cx: 152, cy: 168, grade: 'GOLD',     label: 'Google · USA · $7B' },
  { id: '6', cx: 437, cy: 135, grade: 'SILVER',   label: 'Siemens · Germany' },
  { id: '7', cx: 468, cy: 170, grade: 'GOLD',     label: 'TotalEnergies · Egypt · $340M' },
  { id: '8', cx: 695, cy: 170, grade: 'SILVER',   label: 'LG · South Korea' },
  { id: '9', cx: 175, cy: 280, grade: 'SILVER',   label: 'Vale · Brazil' },
  { id: '10',cx: 435, cy: 290, grade: 'GOLD',     label: 'MTN Group · Nigeria · $180M' },
  { id: '11',cx: 735, cy: 218, grade: 'PLATINUM', label: 'TSMC · Singapore · $8B' },
];

const GRADE_COLOR: Record<string, string> = {
  PLATINUM: '#F59E0B',
  GOLD: '#10B981',
  SILVER: '#60A5FA',
};

export function GlobeMap() {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);
  const [activeDots, setActiveDots] = useState<string[]>([]);
  const containerRef = useRef<SVGSVGElement>(null);

  // Randomly pulse dots to simulate live activity
  useEffect(() => {
    const id = setInterval(() => {
      const count = Math.floor(Math.random() * 3) + 2;
      const shuffled = [...INITIAL_DOTS].sort(() => Math.random() - 0.5);
      setActiveDots(shuffled.slice(0, count).map(d => d.id));
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      ref={containerRef as any}
      className="relative max-w-3xl mx-auto bg-blue-50/60 rounded-2xl overflow-hidden border border-blue-100"
      style={{ aspectRatio: '900/420' }}
    >
      <svg
        viewBox="0 0 900 420"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        aria-label="World map showing live investment signals"
      >
        <defs>
          <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#EFF6FF" />
            <stop offset="100%" stopColor="#DBEAFE" />
          </radialGradient>
        </defs>

        {/* Ocean background */}
        <rect width="900" height="420" fill="url(#bgGrad)" />

        {/* ── LAND MASSES ── simplified but recognisable */}
        {/* North America */}
        <path d="M60 70 L170 55 L210 80 L230 125 L215 175 L190 210 L150 230 L100 225 L65 195 L50 155 L55 110 Z"
          fill="#BFDBFE" stroke="#93C5FD" strokeWidth="1.5" />
        {/* Central America */}
        <path d="M140 230 L175 220 L185 245 L160 270 L130 265 L115 250 Z"
          fill="#BFDBFE" stroke="#93C5FD" strokeWidth="1" />
        {/* South America */}
        <path d="M155 280 L220 268 L245 295 L250 360 L215 405 L175 408 L145 385 L130 340 L138 300 Z"
          fill="#BFDBFE" stroke="#93C5FD" strokeWidth="1.5" />
        {/* Greenland */}
        <path d="M210 20 L295 15 L300 50 L270 70 L230 65 L205 45 Z"
          fill="#BFDBFE" stroke="#93C5FD" strokeWidth="1" />
        {/* Europe */}
        <path d="M385 60 L470 50 L495 78 L488 110 L455 130 L415 130 L388 110 L378 88 Z"
          fill="#BFDBFE" stroke="#93C5FD" strokeWidth="1.5" />
        {/* Scandinavia bump */}
        <path d="M420 40 L455 28 L470 50 L440 58 Z"
          fill="#BFDBFE" stroke="#93C5FD" strokeWidth="1" />
        {/* UK */}
        <path d="M378 68 L400 58 L408 82 L385 88 Z"
          fill="#BFDBFE" stroke="#93C5FD" strokeWidth="1" />
        {/* Africa */}
        <path d="M395 145 L475 132 L510 158 L520 230 L495 305 L455 320 L410 300 L378 255 L368 200 L378 168 Z"
          fill="#BFDBFE" stroke="#93C5FD" strokeWidth="1.5" />
        {/* Middle East / Arabian Peninsula */}
        <path d="M492 148 L560 140 L578 165 L560 200 L525 208 L495 190 L488 165 Z"
          fill="#BFDBFE" stroke="#93C5FD" strokeWidth="1.5" />
        {/* Turkey / Caucasus */}
        <path d="M475 115 L545 105 L568 128 L548 148 L490 148 L472 132 Z"
          fill="#BFDBFE" stroke="#93C5FD" strokeWidth="1" />
        {/* Iran / Central Asia */}
        <path d="M548 105 L648 88 L678 115 L665 150 L620 165 L568 158 L548 135 Z"
          fill="#BFDBFE" stroke="#93C5FD" strokeWidth="1.5" />
        {/* Indian Subcontinent */}
        <path d="M575 155 L660 148 L685 175 L682 230 L648 260 L608 262 L578 235 L565 198 Z"
          fill="#BFDBFE" stroke="#93C5FD" strokeWidth="1.5" />
        {/* Russia / Siberia */}
        <path d="M468 18 L800 10 L820 55 L790 75 L735 80 L650 88 L548 88 L468 68 Z"
          fill="#BFDBFE" stroke="#93C5FD" strokeWidth="1.5" />
        {/* China / East Asia */}
        <path d="M650 88 L775 75 L800 105 L788 150 L748 170 L688 175 L665 150 L648 115 Z"
          fill="#BFDBFE" stroke="#93C5FD" strokeWidth="1.5" />
        {/* Korea / Japan area */}
        <path d="M750 148 L795 138 L810 160 L790 178 L755 172 Z"
          fill="#BFDBFE" stroke="#93C5FD" strokeWidth="1" />
        {/* Southeast Asia */}
        <path d="M678 190 L750 178 L782 208 L768 248 L722 255 L685 230 Z"
          fill="#BFDBFE" stroke="#93C5FD" strokeWidth="1.5" />
        {/* Australia */}
        <path d="M715 298 L820 285 L858 320 L838 378 L770 392 L715 368 L698 328 Z"
          fill="#BFDBFE" stroke="#93C5FD" strokeWidth="1.5" />
        {/* Madagascar */}
        <path d="M510 280 L528 270 L532 308 L510 318 L500 300 Z"
          fill="#BFDBFE" stroke="#93C5FD" strokeWidth="1" />

        {/* ── SIGNAL DOTS ── */}
        {INITIAL_DOTS.map(dot => {
          const color = GRADE_COLOR[dot.grade];
          const isActive = activeDots.includes(dot.id);
          return (
            <g key={dot.id}
              style={{ cursor: 'pointer' }}
              onMouseEnter={(e) => {
                const svg = containerRef.current;
                if (!svg) return;
                const rect = svg.getBoundingClientRect();
                const scaleX = rect.width / 900;
                const scaleY = rect.height / 420;
                setTooltip({
                  x: dot.cx * scaleX,
                  y: dot.cy * scaleY - 32,
                  text: dot.label,
                });
              }}
              onMouseLeave={() => setTooltip(null)}
            >
              {/* Outer pulse ring (only on active) */}
              {isActive && (
                <circle cx={dot.cx} cy={dot.cy} r="10" fill={color} opacity="0.2">
                  <animate attributeName="r" values="6;14;6" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
              {/* Middle ring */}
              <circle cx={dot.cx} cy={dot.cy} r="5" fill={color} opacity="0.3" />
              {/* Core dot */}
              <circle cx={dot.cx} cy={dot.cy} r="3.5" fill={color} opacity="0.95" />
            </g>
          );
        })}

        {/* Grid lines (latitude/longitude hint) */}
        {[90, 180, 270, 360, 450, 540, 630, 720, 810].map(x => (
          <line key={`v${x}`} x1={x} y1={0} x2={x} y2={420} stroke="#93C5FD" strokeWidth="0.3" opacity="0.3" />
        ))}
        {[84, 168, 252, 336].map(y => (
          <line key={`h${y}`} x1={0} y1={y} x2={900} y2={y} stroke="#93C5FD" strokeWidth="0.3" opacity="0.3" />
        ))}
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute pointer-events-none bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-[#0A2540] shadow-md whitespace-nowrap z-10"
          style={{ left: tooltip.x, top: tooltip.y, transform: 'translateX(-50%)' }}
        >
          {tooltip.text}
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-3 right-3 bg-white/90 border border-slate-200 rounded-lg px-3 py-2 text-xs">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-slate-500">Platinum</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-slate-500">Gold</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span className="text-slate-500">Silver</span>
          </span>
        </div>
      </div>

      {/* Live badge */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 border border-slate-200 rounded-full px-3 py-1.5 text-xs font-bold text-slate-600">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        Live · 2-second updates
      </div>
    </div>
  );
}
