interface GlobeMapProps {
  size?: number;
  color?: string;
  showSignals?: boolean;
}

/**
 * GlobeMap — Static SVG globe icon
 * Lightweight globe for use in navbars, cards, and decorative contexts
 */
export default function GlobeMap({ size = 24, color = '#74BB65', showSignals = false }: GlobeMapProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="FDI Monitor globe icon"
    >
      {/* Main circle */}
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" opacity="0.8"/>
      {/* Longitude lines */}
      <ellipse cx="12" cy="12" rx="4.5" ry="10" stroke={color} strokeWidth="1" opacity="0.5"/>
      {/* Equator */}
      <line x1="2" y1="12" x2="22" y2="12" stroke={color} strokeWidth="1" opacity="0.5"/>
      {/* Latitude lines */}
      <path d="M4.5 7.5Q12 5 19.5 7.5" stroke={color} strokeWidth="0.75" opacity="0.4" fill="none"/>
      <path d="M4.5 16.5Q12 19 19.5 16.5" stroke={color} strokeWidth="0.75" opacity="0.4" fill="none"/>
      {/* Signal dots if enabled */}
      {showSignals && (
        <>
          <circle cx="16" cy="9" r="1.5" fill={color} opacity="0.9"/>
          <circle cx="8" cy="14" r="1" fill={color} opacity="0.7"/>
          <circle cx="14" cy="15" r="1" fill={color} opacity="0.6"/>
        </>
      )}
    </svg>
  );
}
