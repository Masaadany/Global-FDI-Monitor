'use client';
import Globe3D from '@/components/Globe3D';

interface Globe4DProps {
  width?: number;
  height?: number;
  className?: string;
}

/**
 * Globe4D — 3D globe with LIVE badge overlay
 * Wraps Globe3D with a pulsing "LIVE" indicator and 4D label
 */
export default function Globe4D({ width = 400, height = 400, className = '' }: Globe4DProps) {
  return (
    <div
      className={`relative select-none ${className}`}
      aria-label="FDI Monitor 4D globe — live signal visualization"
      role="img"
      style={{ width, height }}
    >
      <Globe3D width={width} height={height}/>

      {/* LIVE badge */}
      <div
        className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
        style={{
          background: 'rgba(116,187,101,0.15)',
          border: '1px solid rgba(116,187,101,0.35)',
          backdropFilter: 'blur(6px)',
        }}
        aria-label="Live signal feed active"
      >
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0"
          style={{ background: '#74BB65' }}
        />
        <span
          className="text-xs font-extrabold tracking-wider"
          style={{ color: '#74BB65', fontFamily: "Inter, sans-serif" }}
        >
          LIVE
        </span>
      </div>

      {/* 4D label */}
      <div
        className="absolute bottom-3 left-3 text-xs font-extrabold tracking-widest"
        style={{ color: 'rgba(10,61,98,0.5)' }}
        aria-hidden="true"
      >
        4D
      </div>
    </div>
  );
}
