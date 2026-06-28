/**
 * Inline SVG icons. Decorative icons are marked aria-hidden (Req 9.4); icons that
 * carry meaning on their own get a `title`/`aria-label` from the caller.
 *
 * Line style, 1.7 stroke — matches the calm institutional aesthetic.
 */
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 20, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    focusable: false,
    ...props,
  };
}

export const NewsIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 5h12v14H5a2 2 0 0 1-2-2V7" />
    <path d="M16 8h3a1 1 0 0 1 1 1v8a2 2 0 0 1-2 2" />
    <path d="M7 9h6M7 12h6M7 15h4" />
  </svg>
);

export const DonateIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M20.8 7.6a4.6 4.6 0 0 0-7.8-2.5l-1 1-1-1A4.6 4.6 0 0 0 3.2 9c0 4.2 5.3 7.9 8.8 10 3.5-2.1 8.8-5.8 8.8-10 0-.5-.06-1-.18-1.4z" />
  </svg>
);

export const ResourceIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M3 9h18M8 4v16" />
  </svg>
);

export const SearchIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.2-3.2" />
  </svg>
);

export const PeopleIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="9" cy="8" r="3" />
    <path d="M3 20a6 6 0 0 1 12 0" />
    <path d="M16 5.5a3 3 0 0 1 0 5.8M21 20a6 6 0 0 0-4-5.6" />
  </svg>
);

export const HeartIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M20.8 7.6a4.6 4.6 0 0 0-7.8-2.5l-1 1-1-1A4.6 4.6 0 0 0 3.2 9c0 4.2 5.3 7.9 8.8 10 3.5-2.1 8.8-5.8 8.8-10 0-.5-.06-1-.18-1.4z" />
  </svg>
);

export const PawIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="6" cy="10" r="1.6" />
    <circle cx="10" cy="6.5" r="1.6" />
    <circle cx="14" cy="6.5" r="1.6" />
    <circle cx="18" cy="10" r="1.6" />
    <path d="M8.5 15.5c1-2 2-3 3.5-3s2.5 1 3.5 3c.9 1.7.4 3.6-1.4 4-1 .2-2 .2-2.1.2s-1.1 0-2.1-.2c-1.8-.4-2.3-2.3-1.4-4z" />
  </svg>
);

export const ShieldCheckIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3 5 6v5c0 4.2 2.9 7.6 7 9 4.1-1.4 7-4.8 7-9V6z" />
    <path d="m9 11.5 2 2 4-4" />
  </svg>
);

export const ClockIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export const ArrowRightIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const ExternalIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M14 4h6v6M20 4l-9 9" />
    <path d="M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" />
  </svg>
);

export const MenuIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const CloseIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const ChevronDownIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const ActivityIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 12h4l3 8 4-16 3 8h4" />
  </svg>
);

export const AlertIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3 2 20h20z" />
    <path d="M12 9v5M12 17.5v.5" />
  </svg>
);

export const InfoIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 8v.5" />
  </svg>
);

export const MapIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z" />
    <path d="M9 4v14M15 6v14" />
  </svg>
);

export const InboxIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 13h5l1.5 3h5L21 13" />
    <path d="M5 6h14l2 7v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5z" />
  </svg>
);

/** The brand mark: a stylized civic shield with a seismic line. */
export const BrandMark = (p: IconProps) => (
  <svg
    width={p.size ?? 22}
    height={p.size ?? 22}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden
    focusable="false"
    {...p}
  >
    <path
      d="M12 2.5 4 5.2v6.3c0 5 3.4 8.8 8 10 4.6-1.2 8-5 8-10V5.2z"
      stroke="#f2c14e"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path
      d="M6.5 12.5h2.2l1.4-3 1.8 5 1.5-3.4 1 1.4h2.6"
      stroke="#ffffff"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
