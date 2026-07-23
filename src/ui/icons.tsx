import type { SVGProps } from 'react';

/**
 * Kiçik, asılılıqsız SVG ikonları. Hamısı `currentColor` istifadə edir ki,
 * rəng CSS-dən (mətn rəngi) idarə olunsun.
 */

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export const SelectIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 3l7 17 2.5-7L20 10.5 4 3z" />
  </svg>
);

export const RectIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="4" y="6" width="16" height="12" rx="2" />
  </svg>
);

export const EllipseIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <ellipse cx="12" cy="12" rx="9" ry="7" />
  </svg>
);

export const ArrowIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 20L20 4" />
    <path d="M20 10V4h-6" />
  </svg>
);

export const PenIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 20c4-1 5-9 8-9s2 5 4 5 2-4 4-4" />
  </svg>
);

export const TextIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M5 6V4h14v2M12 4v16M9 20h6" />
  </svg>
);

export const StickyIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M5 4h14v10l-5 5H5z" />
    <path d="M19 14h-5v5" />
  </svg>
);

export const UndoIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M9 7L4 12l5 5" />
    <path d="M4 12h11a5 5 0 010 10h-1" />
  </svg>
);

export const RedoIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M15 7l5 5-5 5" />
    <path d="M20 12H9a5 5 0 000 10h1" />
  </svg>
);

export const DownloadIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 3v12" />
    <path d="M7 10l5 5 5-5" />
    <path d="M4 21h16" />
  </svg>
);

export const SunIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
  </svg>
);

export const MoonIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z" />
  </svg>
);

export const ShareIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1.5 1.5" />
    <path d="M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1.5-1.5" />
  </svg>
);

export const TrashIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
  </svg>
);

export const CheckIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M5 12l5 5L20 6" />
  </svg>
);
