import React from 'react';
import type { VisualKey } from '@/types';

export interface CelestialObjectVisualProps {
  objectId?: string;
  objectName?: string;
  objectType?: string;
  visualKey?: VisualKey;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number;
  className?: string;
  variant?: 'icon' | 'badge' | 'card' | 'glow';
  ariaLabel?: string;
}

/**
 * Resolves any celestial object ID, name, or type to a standard VisualKey.
 * Guaranteed to distinguish Jupiter from Saturn, Moon, Mars, etc.
 */
export function resolveVisualKey(
  input?: { id?: string; name?: string; type?: string; visualKey?: VisualKey } | string
): VisualKey {
  if (!input) return 'jupiter';

  let raw = '';
  if (typeof input === 'string') {
    raw = input.toLowerCase().trim();
  } else {
    if (input.visualKey) return input.visualKey;
    raw = `${input.id || ''} ${input.name || ''} ${input.type || ''}`.toLowerCase().trim();
  }

  // Exact & substring priority matching
  if (raw.includes('saturn')) return 'saturn';
  if (raw.includes('jupiter')) return 'jupiter';
  if (raw.includes('moon') || raw.includes('luna')) return 'moon';
  if (raw.includes('mars')) return 'mars';
  if (raw.includes('venus')) return 'venus';
  if (raw.includes('sirius') || raw.includes('dog star')) return 'sirius';
  if (raw.includes('andromeda') || raw.includes('m31') || raw.includes('galaxy')) return 'andromeda';
  if (raw.includes('nebula') || raw.includes('orion') || raw.includes('dust')) return 'nebula';
  if (raw.includes('star')) return 'sirius';
  if (raw.includes('planet')) return 'jupiter';

  return 'jupiter';
}

const sizePixelMap: Record<string, number> = {
  xs: 16,
  sm: 24,
  md: 36,
  lg: 48,
  xl: 64,
  '2xl': 96,
};

// ─── Individual SVG Visual Renderers ──────────────────────────────────────────

/**
 * Jupiter Visual:
 * - Spherical gas giant with alternating atmospheric cloud bands
 * - Atmospheric streak turbulence
 * - The iconic Great Red Spot storm in the southern hemisphere
 * - NO rings!
 */
function JupiterVisualSvg({ size, idPrefix }: { size: number; idPrefix: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 overflow-visible"
    >
      <defs>
        {/* Sphere Clip Mask */}
        <clipPath id={`${idPrefix}-sphere-clip`}>
          <circle cx="50" cy="50" r="46" />
        </clipPath>

        {/* Base Atmospheric Color Gradient */}
        <linearGradient id={`${idPrefix}-jup-bands`} x1="0" y1="4" x2="0" y2="96" gradientUnits="userSpaceOnUse">
          <stop offset="0.00" stopColor="#9e7943" />
          <stop offset="0.10" stopColor="#c7a361" />
          <stop offset="0.18" stopColor="#8c593b" />
          <stop offset="0.28" stopColor="#e6d3a8" />
          <stop offset="0.38" stopColor="#ba7a4b" />
          <stop offset="0.48" stopColor="#f3e5c8" />
          <stop offset="0.58" stopColor="#8c593b" />
          <stop offset="0.68" stopColor="#deb887" />
          <stop offset="0.78" stopColor="#a36e44" />
          <stop offset="0.88" stopColor="#c7a361" />
          <stop offset="1.00" stopColor="#7a552e" />
        </linearGradient>

        {/* 3D Sphere Shading Overlay (Light from top-left) */}
        <radialGradient id={`${idPrefix}-jup-shadow`} cx="38" cy="36" r="48" fx="32" fy="30" gradientUnits="userSpaceOnUse">
          <stop offset="0.00" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="0.55" stopColor="#000000" stopOpacity="0.0" />
          <stop offset="0.85" stopColor="#1e1005" stopOpacity="0.45" />
          <stop offset="1.00" stopColor="#0a0502" stopOpacity="0.82" />
        </radialGradient>

        {/* Great Red Spot Gradient */}
        <radialGradient id={`${idPrefix}-red-spot`} cx="64" cy="67" r="11" fx="63" fy="66" gradientUnits="userSpaceOnUse">
          <stop offset="0.00" stopColor="#e74c3c" />
          <stop offset="0.45" stopColor="#c0392b" />
          <stop offset="0.85" stopColor="#962d22" />
          <stop offset="1.00" stopColor="#ba7a4b" stopOpacity="0.2" />
        </radialGradient>

        {/* Atmospheric Glow Sheen */}
        <filter id={`${idPrefix}-glow`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Atmospheric Rim Sheen */}
      <circle cx="50" cy="50" r="47" fill="#f59e0b" opacity="0.15" />

      {/* Globe */}
      <g clipPath={`url(#${idPrefix}-sphere-clip)`}>
        {/* Base Bands */}
        <rect x="4" y="4" width="92" height="92" fill={`url(#${idPrefix}-jup-bands)`} />

        {/* Atmospheric Cloud Streaks */}
        <path d="M4 22 Q30 20, 55 23 T96 22" stroke="#ffffff" strokeWidth="2.5" strokeOpacity="0.3" fill="none" />
        <path d="M4 34 Q25 36, 60 33 T96 35" stroke="#5a3418" strokeWidth="3" strokeOpacity="0.4" fill="none" />
        <path d="M4 46 Q35 44, 70 47 T96 45" stroke="#ffffff" strokeWidth="3.5" strokeOpacity="0.45" fill="none" />
        <path d="M4 56 Q20 58, 50 55 T96 57" stroke="#6e391b" strokeWidth="3" strokeOpacity="0.4" fill="none" />
        <path d="M4 72 Q40 70, 75 73 T96 71" stroke="#ffffff" strokeWidth="2" strokeOpacity="0.35" fill="none" />
        <path d="M4 80 Q30 82, 65 79 T96 81" stroke="#4a250f" strokeWidth="2" strokeOpacity="0.4" fill="none" />

        {/* Great Red Spot Storm */}
        <ellipse cx="64" cy="65" rx="10" ry="6" fill={`url(#${idPrefix}-red-spot)`} transform="rotate(-3 64 65)" />
        {/* Red Spot Eye Swirl */}
        <ellipse cx="64" cy="65" rx="5" ry="2.5" fill="#f97316" opacity="0.85" transform="rotate(-3 64 65)" />
        <path d="M52 64 Q58 61, 64 61 T76 64" stroke="#78281f" strokeWidth="1" fill="none" opacity="0.6" />

        {/* White Oval Storms */}
        <ellipse cx="30" cy="74" rx="3.5" ry="2" fill="#ffffff" opacity="0.75" />
        <ellipse cx="44" cy="75" rx="2.5" ry="1.5" fill="#ffffff" opacity="0.65" />
        <ellipse cx="35" cy="27" rx="3" ry="1.8" fill="#ffffff" opacity="0.6" />

        {/* 3D Curvature & Shadow Overlay */}
        <circle cx="50" cy="50" r="46" fill={`url(#${idPrefix}-jup-shadow)`} />
      </g>

      {/* Outer Crisp Ring Border */}
      <circle cx="50" cy="50" r="46" stroke="#c7a361" strokeWidth="0.8" strokeOpacity="0.6" fill="none" />
    </svg>
  );
}

/**
 * Saturn Visual:
 * - Butter-cream planetary globe
 * - Iconic multi-layer tilted rings with Cassini Division
 * - Proper front/rear ring z-ordering
 */
function SaturnVisualSvg({ size, idPrefix }: { size: number; idPrefix: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 overflow-visible"
    >
      <defs>
        <clipPath id={`${idPrefix}-sat-globe-clip`}>
          <circle cx="60" cy="50" r="28" />
        </clipPath>

        {/* Saturn Bands Gradient */}
        <linearGradient id={`${idPrefix}-sat-bands`} x1="0" y1="22" x2="0" y2="78" gradientUnits="userSpaceOnUse">
          <stop offset="0.0" stopColor="#baa26f" />
          <stop offset="0.2" stopColor="#ebdcb2" />
          <stop offset="0.4" stopColor="#c9b480" />
          <stop offset="0.6" stopColor="#f3e6c9" />
          <stop offset="0.8" stopColor="#d4be88" />
          <stop offset="1.0" stopColor="#a38c58" />
        </linearGradient>

        {/* 3D Globe Shadow */}
        <radialGradient id={`${idPrefix}-sat-shadow`} cx="52" cy="42" r="30" fx="48" fy="38" gradientUnits="userSpaceOnUse">
          <stop offset="0.0" stopColor="#ffffff" stopOpacity="0.3" />
          <stop offset="0.6" stopColor="#000000" stopOpacity="0.0" />
          <stop offset="0.9" stopColor="#1a1408" stopOpacity="0.5" />
          <stop offset="1.0" stopColor="#080602" stopOpacity="0.85" />
        </radialGradient>

        {/* Ring System Gradient */}
        <linearGradient id={`${idPrefix}-ring-grad`} x1="0" y1="0" x2="120" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0.00" stopColor="#d4be88" stopOpacity="0.0" />
          <stop offset="0.12" stopColor="#e8d8b0" stopOpacity="0.75" />
          <stop offset="0.28" stopColor="#f7eed8" stopOpacity="0.95" />
          <stop offset="0.33" stopColor="#2d2416" stopOpacity="0.3" /> {/* Cassini Division */}
          <stop offset="0.37" stopColor="#e5d2a4" stopOpacity="0.9" />
          <stop offset="0.63" stopColor="#e5d2a4" stopOpacity="0.9" />
          <stop offset="0.67" stopColor="#2d2416" stopOpacity="0.3" /> {/* Cassini Division */}
          <stop offset="0.72" stopColor="#f7eed8" stopOpacity="0.95" />
          <stop offset="0.88" stopColor="#e8d8b0" stopOpacity="0.75" />
          <stop offset="1.00" stopColor="#d4be88" stopOpacity="0.0" />
        </linearGradient>

        {/* Clip for Front Half of Rings */}
        <clipPath id={`${idPrefix}-front-ring-clip`}>
          <rect x="0" y="48" width="120" height="52" />
        </clipPath>
      </defs>

      <g transform="rotate(-18 60 50)">
        {/* REAR HALF OF RINGS (Behind planet) */}
        <g opacity="0.92">
          {/* Broad Ring Disc */}
          <ellipse cx="60" cy="50" rx="55" ry="15" fill={`url(#${idPrefix}-ring-grad)`} />
          {/* Inner Clear Gap */}
          <ellipse cx="60" cy="50" rx="34" ry="9" fill="transparent" stroke="#0f172a" strokeWidth="0" />
          {/* Cassini Division Line */}
          <ellipse cx="60" cy="50" rx="46" ry="12.5" stroke="#2b2011" strokeWidth="1.2" strokeOpacity="0.7" fill="none" />
          <ellipse cx="60" cy="50" rx="54" ry="14.6" stroke="#cbb584" strokeWidth="0.8" strokeOpacity="0.5" fill="none" />
        </g>

        {/* SATURN GLOBE */}
        <g clipPath={`url(#${idPrefix}-sat-globe-clip)`}>
          <circle cx="60" cy="50" r="28" fill={`url(#${idPrefix}-sat-bands)`} />
          {/* Subtle Bands */}
          <line x1="32" y1="42" x2="88" y2="42" stroke="#ffffff" strokeWidth="2" strokeOpacity="0.35" />
          <line x1="32" y1="56" x2="88" y2="56" stroke="#8c7340" strokeWidth="2.5" strokeOpacity="0.35" />
          {/* Ring Shadow across globe */}
          <path d="M32 49 Q60 55 88 49 Q60 52 32 49 Z" fill="#140f06" opacity="0.6" />
          {/* 3D Sphere Lighting */}
          <circle cx="60" cy="50" r="28" fill={`url(#${idPrefix}-sat-shadow)`} />
        </g>
        <circle cx="60" cy="50" r="28" stroke="#d4be88" strokeWidth="0.6" strokeOpacity="0.5" fill="none" />

        {/* FRONT HALF OF RINGS (In front of planet) */}
        <g clipPath={`url(#${idPrefix}-front-ring-clip)`} opacity="0.95">
          {/* Broad Ring Disc */}
          <ellipse cx="60" cy="50" rx="55" ry="15" fill={`url(#${idPrefix}-ring-grad)`} />
          {/* Inner Clear Cutout */}
          <ellipse cx="60" cy="50" rx="34" ry="9" fill="none" stroke="#2b2011" strokeWidth="1" strokeOpacity="0.4" />
          {/* Cassini Division Line */}
          <ellipse cx="60" cy="50" rx="46" ry="12.5" stroke="#2b2011" strokeWidth="1.2" strokeOpacity="0.7" fill="none" />
          <ellipse cx="60" cy="50" rx="54" ry="14.6" stroke="#cbb584" strokeWidth="0.8" strokeOpacity="0.6" fill="none" />
        </g>
      </g>
    </svg>
  );
}

/**
 * Moon Visual:
 * - Detailed lunar craters and maria
 * - Crater rim highlights and dark basalt plains
 */
function MoonVisualSvg({ size, idPrefix }: { size: number; idPrefix: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 overflow-visible"
    >
      <defs>
        <clipPath id={`${idPrefix}-moon-clip`}>
          <circle cx="50" cy="50" r="46" />
        </clipPath>

        <linearGradient id={`${idPrefix}-moon-base`} x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0.0" stopColor="#e2e8f0" />
          <stop offset="0.6" stopColor="#cbd5e1" />
          <stop offset="1.0" stopColor="#94a3b8" />
        </linearGradient>

        <radialGradient id={`${idPrefix}-moon-shadow`} cx="36" cy="34" r="50" fx="30" fy="28" gradientUnits="userSpaceOnUse">
          <stop offset="0.0" stopColor="#ffffff" stopOpacity="0.3" />
          <stop offset="0.6" stopColor="#000000" stopOpacity="0.0" />
          <stop offset="0.9" stopColor="#1e293b" stopOpacity="0.5" />
          <stop offset="1.0" stopColor="#0f172a" stopOpacity="0.85" />
        </radialGradient>
      </defs>

      {/* Subtle Moon Halo */}
      <circle cx="50" cy="50" r="48" fill="#e2e8f0" opacity="0.12" />

      <g clipPath={`url(#${idPrefix}-moon-clip)`}>
        {/* Base Regolith */}
        <circle cx="50" cy="50" r="46" fill={`url(#${idPrefix}-moon-base)`} />

        {/* Lunar Maria (Dark Basaltic Plains) */}
        <path
          d="M20 30 Q35 15, 52 28 Q48 45, 30 46 Q15 42, 20 30 Z"
          fill="#64748b"
          opacity="0.65"
        />
        <path
          d="M56 32 Q75 30, 78 48 Q68 62, 54 52 Q50 38, 56 32 Z"
          fill="#64748b"
          opacity="0.6"
        />
        <ellipse cx="80" cy="38" rx="6" ry="4.5" fill="#475569" opacity="0.7" />
        <path
          d="M28 58 Q42 54, 45 68 Q38 80, 24 76 Q20 66, 28 58 Z"
          fill="#64748b"
          opacity="0.55"
        />

        {/* Prominent Impact Craters with sunlit rims */}
        <circle cx="48" cy="78" r="4.5" fill="#475569" />
        <circle cx="47" cy="77.5" r="4.5" stroke="#f8fafc" strokeWidth="1" fill="none" opacity="0.9" />
        <circle cx="48" cy="78" r="1.5" fill="#f8fafc" />

        <circle cx="34" cy="46" r="4" fill="#475569" />
        <circle cx="33.5" cy="45.5" r="4" stroke="#f8fafc" strokeWidth="0.9" fill="none" opacity="0.85" />

        <circle cx="22" cy="48" r="2.8" fill="#475569" />
        <circle cx="21.5" cy="47.5" r="2.8" stroke="#f8fafc" strokeWidth="0.7" fill="none" opacity="0.8" />

        <ellipse cx="44" cy="22" rx="3.5" ry="2" fill="#334155" />
        <ellipse cx="44" cy="21.7" rx="3.5" ry="2" stroke="#f8fafc" strokeWidth="0.6" fill="none" opacity="0.7" />

        <circle cx="68" cy="68" r="2.5" fill="#475569" />
        <circle cx="67.7" cy="67.7" r="2.5" stroke="#f8fafc" strokeWidth="0.6" fill="none" opacity="0.6" />
        <circle cx="76" cy="56" r="2" fill="#475569" />
        <circle cx="62" cy="20" r="2.2" fill="#475569" />

        {/* 3D Terminator Shadow */}
        <circle cx="50" cy="50" r="46" fill={`url(#${idPrefix}-moon-shadow)`} />
      </g>

      <circle cx="50" cy="50" r="46" stroke="#94a3b8" strokeWidth="0.8" strokeOpacity="0.5" fill="none" />
    </svg>
  );
}

/**
 * Mars Visual:
 * - Red Planet iron-oxide terrain
 * - Dark volcanic highlands (Syrtis Major)
 * - White polar ice cap
 */
function MarsVisualSvg({ size, idPrefix }: { size: number; idPrefix: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 overflow-visible"
    >
      <defs>
        <clipPath id={`${idPrefix}-mars-clip`}>
          <circle cx="50" cy="50" r="46" />
        </clipPath>

        <radialGradient id={`${idPrefix}-mars-base`} cx="38" cy="34" r="50" fx="32" fy="28" gradientUnits="userSpaceOnUse">
          <stop offset="0.0" stopColor="#fb923c" />
          <stop offset="0.4" stopColor="#ea580c" />
          <stop offset="0.8" stopColor="#c2410c" />
          <stop offset="1.0" stopColor="#7c2d12" />
        </radialGradient>

        <radialGradient id={`${idPrefix}-mars-shadow`} cx="36" cy="34" r="50" fx="30" fy="28" gradientUnits="userSpaceOnUse">
          <stop offset="0.0" stopColor="#ffffff" stopOpacity="0.25" />
          <stop offset="0.6" stopColor="#000000" stopOpacity="0.0" />
          <stop offset="0.85" stopColor="#450a0a" stopOpacity="0.5" />
          <stop offset="1.0" stopColor="#1a0404" stopOpacity="0.85" />
        </radialGradient>
      </defs>

      <circle cx="50" cy="50" r="48" fill="#ea580c" opacity="0.15" />

      <g clipPath={`url(#${idPrefix}-mars-clip)`}>
        <circle cx="50" cy="50" r="46" fill={`url(#${idPrefix}-mars-base)`} />

        <path
          d="M38 35 Q55 30, 68 45 Q75 60, 58 66 Q42 62, 35 48 Z"
          fill="#5a1a08"
          opacity="0.65"
        />
        <path
          d="M20 54 Q35 50, 42 62 Q30 72, 18 68 Z"
          fill="#5a1a08"
          opacity="0.55"
        />
        <path
          d="M60 28 Q78 24, 82 38 Q74 44, 62 38 Z"
          fill="#5a1a08"
          opacity="0.5"
        />

        <ellipse cx="50" cy="9" rx="16" ry="6" fill="#f8fafc" opacity="0.95" />
        <ellipse cx="50" cy="9.5" rx="14" ry="4.5" fill="#e2e8f0" />

        <ellipse cx="50" cy="92" rx="11" ry="4" fill="#f8fafc" opacity="0.85" />

        <circle cx="50" cy="50" r="46" fill={`url(#${idPrefix}-mars-shadow)`} />
      </g>

      <circle cx="50" cy="50" r="46" stroke="#c2410c" strokeWidth="0.8" strokeOpacity="0.6" fill="none" />
    </svg>
  );
}

/**
 * Venus Visual:
 * - Swirling golden-amber and cream atmosphere
 */
function VenusVisualSvg({ size, idPrefix }: { size: number; idPrefix: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 overflow-visible"
    >
      <defs>
        <clipPath id={`${idPrefix}-venus-clip`}>
          <circle cx="50" cy="50" r="46" />
        </clipPath>

        <linearGradient id={`${idPrefix}-venus-base`} x1="0" y1="4" x2="0" y2="96" gradientUnits="userSpaceOnUse">
          <stop offset="0.0" stopColor="#d97706" />
          <stop offset="0.25" stopColor="#f59e0b" />
          <stop offset="0.5" stopColor="#fef08a" />
          <stop offset="0.75" stopColor="#f59e0b" />
          <stop offset="1.0" stopColor="#b45309" />
        </linearGradient>

        <radialGradient id={`${idPrefix}-venus-shadow`} cx="36" cy="34" r="50" fx="30" fy="28" gradientUnits="userSpaceOnUse">
          <stop offset="0.0" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="0.6" stopColor="#000000" stopOpacity="0.0" />
          <stop offset="0.9" stopColor="#451a03" stopOpacity="0.5" />
          <stop offset="1.0" stopColor="#1e0a02" stopOpacity="0.85" />
        </radialGradient>
      </defs>

      <circle cx="50" cy="50" r="48" fill="#f59e0b" opacity="0.18" />

      <g clipPath={`url(#${idPrefix}-venus-clip)`}>
        <circle cx="50" cy="50" r="46" fill={`url(#${idPrefix}-venus-base)`} />

        <path d="M4 28 Q40 18, 70 26 T96 22" stroke="#ffffff" strokeWidth="4" strokeOpacity="0.4" fill="none" />
        <path d="M4 42 Q30 50, 65 44 T96 48" stroke="#ca8a04" strokeWidth="5" strokeOpacity="0.35" fill="none" />
        <path d="M4 60 Q45 52, 75 64 T96 58" stroke="#ffffff" strokeWidth="3.5" strokeOpacity="0.35" fill="none" />
        <path d="M4 76 Q35 84, 70 78 T96 82" stroke="#92400e" strokeWidth="4" strokeOpacity="0.3" fill="none" />

        <circle cx="50" cy="50" r="46" fill={`url(#${idPrefix}-venus-shadow)`} />
      </g>

      <circle cx="50" cy="50" r="46" stroke="#f59e0b" strokeWidth="0.8" strokeOpacity="0.6" fill="none" />
    </svg>
  );
}

/**
 * Sirius / Star Visual:
 * - Brilliant luminous blue-white stellar core
 * - 4-point & 8-point stellar diffraction spikes
 * - Radiant corona glow
 */
function StarVisualSvg({ size, idPrefix }: { size: number; idPrefix: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 overflow-visible"
    >
      <defs>
        <radialGradient id={`${idPrefix}-star-core`} cx="50" cy="50" r="45" gradientUnits="userSpaceOnUse">
          <stop offset="0.0" stopColor="#ffffff" />
          <stop offset="0.2" stopColor="#e0f2fe" />
          <stop offset="0.45" stopColor="#38bdf8" />
          <stop offset="0.75" stopColor="#0284c7" stopOpacity="0.4" />
          <stop offset="1.0" stopColor="#0369a1" stopOpacity="0.0" />
        </radialGradient>

        <linearGradient id={`${idPrefix}-spike-v`} x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0.0" stopColor="#38bdf8" stopOpacity="0.0" />
          <stop offset="0.45" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="0.5" stopColor="#ffffff" />
          <stop offset="0.55" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="1.0" stopColor="#38bdf8" stopOpacity="0.0" />
        </linearGradient>

        <linearGradient id={`${idPrefix}-spike-h`} x1="0" y1="50" x2="100" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0.0" stopColor="#38bdf8" stopOpacity="0.0" />
          <stop offset="0.45" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="0.5" stopColor="#ffffff" />
          <stop offset="0.55" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="1.0" stopColor="#38bdf8" stopOpacity="0.0" />
        </linearGradient>
      </defs>

      <circle cx="50" cy="50" r="42" fill={`url(#${idPrefix}-star-core)`} />
      <circle cx="50" cy="50" r="26" fill="#38bdf8" opacity="0.3" />

      <g transform="rotate(45 50 50)" opacity="0.6">
        <path d="M48 6 L52 6 L50.5 50 L52 94 L48 94 L49.5 50 Z" fill="#bae6fd" />
        <path d="M6 48 L6 52 L50 50.5 L94 52 L94 48 L50 49.5 Z" fill="#bae6fd" />
      </g>

      <path d="M47.5 2 L52.5 2 L51 50 L52.5 98 L47.5 98 L49 50 Z" fill={`url(#${idPrefix}-spike-v)`} />
      <path d="M2 47.5 L2 52.5 L50 51 L98 52.5 L98 47.5 L50 49 Z" fill={`url(#${idPrefix}-spike-h)`} />

      <polygon points="50,28 55,50 50,72 45,50" fill="#ffffff" opacity="0.95" />
      <polygon points="28,50 50,55 72,50 50,45" fill="#ffffff" opacity="0.95" />

      <circle cx="50" cy="50" r="10" fill="#ffffff" />
      <circle cx="50" cy="50" r="6" fill="#f0f9ff" />
    </svg>
  );
}

/**
 * Andromeda Galaxy Visual:
 * - Tilted spiral galaxy with bright nucleus
 * - Swirling spiral arms and dust lanes
 */
function AndromedaVisualSvg({ size, idPrefix }: { size: number; idPrefix: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 overflow-visible"
    >
      <defs>
        <radialGradient id={`${idPrefix}-gal-core`} cx="50" cy="50" r="20" fx="50" fy="50" gradientUnits="userSpaceOnUse">
          <stop offset="0.0" stopColor="#ffffff" />
          <stop offset="0.25" stopColor="#fdf4ff" />
          <stop offset="0.55" stopColor="#e879f9" />
          <stop offset="0.85" stopColor="#a855f7" stopOpacity="0.6" />
          <stop offset="1.0" stopColor="#6b21a8" stopOpacity="0.0" />
        </radialGradient>

        <radialGradient id={`${idPrefix}-gal-disc`} cx="50" cy="50" r="48" fx="50" fy="50" gradientUnits="userSpaceOnUse">
          <stop offset="0.0" stopColor="#c084fc" stopOpacity="0.9" />
          <stop offset="0.35" stopColor="#818cf8" stopOpacity="0.7" />
          <stop offset="0.7" stopColor="#4f46e5" stopOpacity="0.35" />
          <stop offset="1.0" stopColor="#1e1b4b" stopOpacity="0.0" />
        </radialGradient>
      </defs>

      <g transform="rotate(-28 50 50)">
        <ellipse cx="50" cy="50" rx="46" ry="22" fill={`url(#${idPrefix}-gal-disc)`} />

        <path
          d="M50 50 Q65 42, 78 46 Q88 52, 90 56 Q75 48, 62 48 Q54 50, 50 50 Z"
          fill="#c084fc"
          opacity="0.8"
        />
        <path
          d="M50 50 Q35 58, 22 54 Q12 48, 10 44 Q25 52, 38 52 Q46 50, 50 50 Z"
          fill="#c084fc"
          opacity="0.8"
        />

        <path
          d="M50 50 Q58 38, 70 38 Q82 42, 85 46 Q72 36, 56 42 Z"
          fill="#818cf8"
          opacity="0.75"
        />
        <path
          d="M50 50 Q42 62, 30 62 Q18 58, 15 54 Q28 64, 44 58 Z"
          fill="#818cf8"
          opacity="0.75"
        />

        <path
          d="M24 53 Q50 51, 76 47"
          stroke="#0f172a"
          strokeWidth="1.8"
          strokeOpacity="0.55"
          fill="none"
        />

        <circle cx="68" cy="44" r="1" fill="#ffffff" opacity="0.9" />
        <circle cx="75" cy="48" r="0.8" fill="#e0e7ff" opacity="0.8" />
        <circle cx="32" cy="56" r="1" fill="#ffffff" opacity="0.9" />
        <circle cx="25" cy="52" r="0.8" fill="#e0e7ff" opacity="0.8" />
        <circle cx="58" cy="38" r="0.7" fill="#ffffff" opacity="0.85" />
        <circle cx="42" cy="62" r="0.7" fill="#ffffff" opacity="0.85" />

        <ellipse cx="50" cy="50" rx="14" ry="7" fill={`url(#${idPrefix}-gal-core)`} />
        <ellipse cx="50" cy="50" rx="6" ry="3" fill="#ffffff" />
      </g>
    </svg>
  );
}

/**
 * Nebula Visual:
 * - Colorful deep space cosmic dust and ionization cloud
 */
function NebulaVisualSvg({ size, idPrefix }: { size: number; idPrefix: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 overflow-visible"
    >
      <defs>
        <radialGradient id={`${idPrefix}-neb-glow`} cx="50" cy="50" r="46" fx="45" fy="45" gradientUnits="userSpaceOnUse">
          <stop offset="0.0" stopColor="#ec4899" stopOpacity="0.9" />
          <stop offset="0.35" stopColor="#8b5cf6" stopOpacity="0.75" />
          <stop offset="0.65" stopColor="#06b6d4" stopOpacity="0.45" />
          <stop offset="1.0" stopColor="#0284c7" stopOpacity="0.0" />
        </radialGradient>
      </defs>

      <circle cx="50" cy="50" r="44" fill={`url(#${idPrefix}-neb-glow)`} />

      <path
        d="M20 40 Q35 15, 65 25 Q85 35, 75 65 Q60 85, 35 75 Q15 65, 20 40 Z"
        fill="#f43f5e"
        opacity="0.5"
      />
      <path
        d="M30 30 Q60 20, 75 45 Q80 70, 50 78 Q25 70, 30 30 Z"
        fill="#06b6d4"
        opacity="0.45"
      />
      <path
        d="M40 35 Q65 30, 68 55 Q62 70, 42 65 Q30 55, 40 35 Z"
        fill="#ffffff"
        opacity="0.4"
      />

      <circle cx="48" cy="46" r="2.5" fill="#ffffff" />
      <circle cx="48" cy="46" r="4.5" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.5" fill="none" />
      <circle cx="62" cy="38" r="1.5" fill="#ffffff" />
      <circle cx="36" cy="58" r="1.2" fill="#ffffff" />
      <circle cx="68" cy="62" r="1" fill="#ffffff" opacity="0.8" />
    </svg>
  );
}

// ─── Main CelestialObjectVisual Component ─────────────────────────────────────

export function CelestialObjectVisual({
  objectId,
  objectName,
  objectType,
  visualKey,
  size = 'md',
  className = '',
  variant = 'icon',
  ariaLabel,
}: CelestialObjectVisualProps) {
  const pixelSize = typeof size === 'number' ? size : sizePixelMap[size] || 36;

  const resolvedKey = resolveVisualKey({
    id: objectId,
    name: objectName,
    type: objectType,
    visualKey,
  });

  const idPrefix = React.useId().replace(/:/g, '');

  const label =
    ariaLabel ||
    objectName ||
    objectId ||
    `${resolvedKey.charAt(0).toUpperCase() + resolvedKey.slice(1)} Visual`;

  const renderSvg = () => {
    switch (resolvedKey) {
      case 'jupiter':
        return <JupiterVisualSvg size={pixelSize} idPrefix={idPrefix} />;
      case 'saturn':
        return <SaturnVisualSvg size={pixelSize} idPrefix={idPrefix} />;
      case 'moon':
        return <MoonVisualSvg size={pixelSize} idPrefix={idPrefix} />;
      case 'mars':
        return <MarsVisualSvg size={pixelSize} idPrefix={idPrefix} />;
      case 'venus':
        return <VenusVisualSvg size={pixelSize} idPrefix={idPrefix} />;
      case 'sirius':
      case 'star':
        return <StarVisualSvg size={pixelSize} idPrefix={idPrefix} />;
      case 'andromeda':
      case 'galaxy':
        return <AndromedaVisualSvg size={pixelSize} idPrefix={idPrefix} />;
      case 'nebula':
        return <NebulaVisualSvg size={pixelSize} idPrefix={idPrefix} />;
      default:
        return <JupiterVisualSvg size={pixelSize} idPrefix={idPrefix} />;
    }
  };

  if (variant === 'badge') {
    return (
      <div
        className={`relative inline-flex items-center justify-center rounded-2xl bg-white/10 border border-white/20 p-2.5 shadow-md backdrop-blur-xs shrink-0 ${className}`}
        role="img"
        aria-label={label}
      >
        {renderSvg()}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div
        className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-white/10 via-cyan-500/5 to-blue-600/10 border border-border/60 p-3 shadow-sm shrink-0 ${className}`}
        role="img"
        aria-label={label}
      >
        {renderSvg()}
      </div>
    );
  }

  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
      role="img"
      aria-label={label}
      style={{ width: pixelSize, height: pixelSize }}
    >
      {renderSvg()}
    </span>
  );
}
