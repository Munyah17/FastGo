import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base(
  props: IconProps,
  children: React.ReactNode,
  filled = false
) {
  const { size = 20, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const Menu = (p: IconProps) =>
  base(p, <><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" /></>);

export const Bell = (p: IconProps) =>
  base(p, <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></>);

export const Search = (p: IconProps) =>
  base(p, <><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.5" y2="16.5" /></>);

export const Plus = (p: IconProps) =>
  base(p, <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>);

export const ArrowLeft = (p: IconProps) =>
  base(p, <><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></>);

export const ChevronRight = (p: IconProps) =>
  base(p, <polyline points="9 18 15 12 9 6" />);

export const ChevronLeft = (p: IconProps) =>
  base(p, <polyline points="15 18 9 12 15 6" />);

export const ChevronDown = (p: IconProps) =>
  base(p, <polyline points="6 9 12 15 18 9" />);

export const Home = (p: IconProps) =>
  base(p, <><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /><path d="M10 21v-6h4v6" /></>);

export const Dollar = (p: IconProps) =>
  base(p, <><circle cx="12" cy="12" r="9" /><path d="M14.5 8.5c-.5-1-1.4-1.5-2.5-1.5-1.5 0-2.5 1-2.5 2.2 0 3 5 1.6 5 4.6 0 1.2-1 2.2-2.5 2.2-1.1 0-2-.5-2.5-1.5" /><line x1="12" y1="5.5" x2="12" y2="18.5" /></>);

export const Wallet = (p: IconProps) =>
  base(p, <><path d="M20 7H5a2 2 0 0 1 0-4h13v4" /><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1" /><circle cx="16.5" cy="13.5" r="1" fill="currentColor" stroke="none" /></>);

export const Chat = (p: IconProps) =>
  base(p, <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />);

export const User = (p: IconProps) =>
  base(p, <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" /></>);

export const Shield = (p: IconProps) =>
  base(p, <path d="M12 2 4 5.5v5.6c0 5 3.4 8.8 8 10.4 4.6-1.6 8-5.4 8-10.4V5.5z" />);

export const ShieldCheck = (p: IconProps) =>
  base(p, <><path d="M12 2 4 5.5v5.6c0 5 3.4 8.8 8 10.4 4.6-1.6 8-5.4 8-10.4V5.5z" /><polyline points="8.5 11.8 11 14.3 15.5 9.8" /></>);

export const Phone = (p: IconProps) =>
  base(p, <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.13.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.25a2 2 0 0 1 2.1-.45c.9.34 1.84.57 2.8.7A2 2 0 0 1 22 16.9z" />);

export const Headset = (p: IconProps) =>
  base(p, <><path d="M4 14v-3a8 8 0 0 1 16 0v3" /><path d="M2 16a2 2 0 0 1 2-2h1v6H4a2 2 0 0 1-2-2z" /><path d="M22 16a2 2 0 0 0-2-2h-1v6h1a2 2 0 0 0 2-2z" /><path d="M20 20a3 3 0 0 1-3 3h-3" /></>);

export const Star = (p: IconProps) =>
  base(p, <path d="M12 2.5l2.9 5.9 6.5 1-4.7 4.6 1.1 6.5L12 17.4l-5.8 3.1 1.1-6.5L2.6 9.4l6.5-1z" />, true);

export const Swap = (p: IconProps) =>
  base(p, <><polyline points="8 7 4 11 8 15" /><line x1="4" y1="11" x2="14" y2="11" /><polyline points="16 9 20 13 16 17" transform="rotate(180 18 13)" /><line x1="10" y1="13" x2="20" y2="13" transform="rotate(180 15 13)" /></>);

export const Eye = (p: IconProps) =>
  base(p, <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></>);

export const Calendar = (p: IconProps) =>
  base(p, <><rect x="3" y="5" width="18" height="17" rx="2" /><line x1="3" y1="10" x2="21" y2="10" /><line x1="8" y1="2.5" x2="8" y2="7" /><line x1="16" y1="2.5" x2="16" y2="7" /></>);

export const Gear = (p: IconProps) =>
  base(p, <><circle cx="12" cy="12" r="3.2" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 8.98 19.4a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 8.98a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H9a1.7 1.7 0 0 0 1.03-1.56V3a2 2 0 1 1 4 0v.09c0 .68.4 1.3 1.03 1.56a1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V9c.26.63.88 1.03 1.56 1.03H21a2 2 0 1 1 0 4h-.09c-.68 0-1.3.4-1.51.97z" /></>);

export const Share = (p: IconProps) =>
  base(p, <><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.6" y1="10.5" x2="15.4" y2="6.5" /><line x1="8.6" y1="13.5" x2="15.4" y2="17.5" /></>);

export const Flag = (p: IconProps) =>
  base(p, <><path d="M5 21V4a1 1 0 0 1 1-1h12l-3 4.5L18 12H6" /></>);

export const Users = (p: IconProps) =>
  base(p, <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c0-3.3 2.9-5.5 6.5-5.5s6.5 2.2 6.5 5.5" /><path d="M16.5 4.8a3.5 3.5 0 0 1 0 6.4" /><path d="M18.5 14.9c2 .8 3 2.6 3 5.1" /></>);

export const Mic = (p: IconProps) =>
  base(p, <><rect x="9" y="2.5" width="6" height="12" rx="3" /><path d="M5 11a7 7 0 0 0 14 0" /><line x1="12" y1="18" x2="12" y2="21.5" /></>);

export const Pin = (p: IconProps) =>
  base(p, <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3" /><line x1="12" y1="3" x2="12" y2="6" /></>);

export const Doc = (p: IconProps) =>
  base(p, <><path d="M14 2.5H6a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.5z" /><polyline points="14 2.5 14 8.5 20 8.5" /><line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="13" y2="17" /></>);

export const Info = (p: IconProps) =>
  base(p, <><circle cx="12" cy="12" r="9" /><line x1="12" y1="11" x2="12" y2="16.5" /><circle cx="12" cy="7.8" r="0.5" fill="currentColor" /></>);

export const Car = (p: IconProps) =>
  base(p, <><path d="M4 16v-4l2-5a2 2 0 0 1 1.9-1.3h8.2A2 2 0 0 1 18 7l2 5v4" /><path d="M2.5 16h19" /><path d="M4 16v3.5h2.5V16M17.5 16v3.5H20V16" /><circle cx="7.5" cy="13" r="0.6" fill="currentColor" /><circle cx="16.5" cy="13" r="0.6" fill="currentColor" /></>);

export const Scale = (p: IconProps) =>
  base(p, <><line x1="12" y1="3" x2="12" y2="21" /><path d="M8 21h8" /><path d="M5 7h14" /><path d="M5 7 2.8 12a2.7 2.7 0 0 0 4.4 0z" /><path d="M19 7l-2.2 5a2.7 2.7 0 0 0 4.4 0z" /></>);

export const Question = (p: IconProps) =>
  base(p, <><circle cx="12" cy="12" r="9" /><path d="M9.3 9a2.8 2.8 0 0 1 5.4 1c0 1.8-2.7 2.2-2.7 4" /><circle cx="12" cy="17.3" r="0.5" fill="currentColor" /></>);

export const MapPin = (p: IconProps) =>
  base(p, <><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" /></>);

export const Briefcase = (p: IconProps) =>
  base(p, <><rect x="3" y="7.5" width="18" height="13" rx="2" /><path d="M9 7.5V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2.5" /></>);

export const Trophy = (p: IconProps) =>
  base(p, <><path d="M8 4h8v5a4 4 0 0 1-8 0z" /><path d="M8 5H5a3 3 0 0 0 3 4M16 5h3a3 3 0 0 1-3 4" /><line x1="12" y1="13" x2="12" y2="17" /><path d="M8.5 20.5h7l-1-3.5h-5z" /></>);

export const TrendUp = (p: IconProps) =>
  base(p, <><polyline points="3 17 9 11 13 15 21 7" /><polyline points="15 7 21 7 21 13" /></>);

export const CheckCircle = (p: IconProps) =>
  base(p, <><circle cx="12" cy="12" r="9" /><polyline points="8 12.3 11 15.3 16 9.5" /></>);

export const CreditCard = (p: IconProps) =>
  base(p, <><rect x="2.5" y="5" width="19" height="14" rx="2" /><line x1="2.5" y1="10" x2="21.5" y2="10" /></>);

export const Download = (p: IconProps) =>
  base(p, <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></>);

export const Upload = (p: IconProps) =>
  base(p, <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 8 12 3 17 8" /><line x1="12" y1="3" x2="12" y2="15" /></>);

export const Navigation = (p: IconProps) =>
  base(p, <path d="M3 11 22 2l-9 19-2-8z" />);

export const Clock = (p: IconProps) =>
  base(p, <><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15.5 14" /></>);

export const Loader2 = (p: IconProps) =>
  base(p, <path d="M12 3a9 9 0 1 0 9 9" />);

export const Lock = (p: IconProps) =>
  base(p, <><rect x="4" y="10.5" width="16" height="10.5" rx="2" /><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" /></>);

export const EyeOff = (p: IconProps) =>
  base(p, <><path d="M17.94 17.94A10.4 10.4 0 0 1 12 19c-6.5 0-10-7-10-7a17.6 17.6 0 0 1 4.1-4.9" /><path d="M9.9 5.2A9.4 9.4 0 0 1 12 5c6.5 0 10 7 10 7a17.7 17.7 0 0 1-2.2 3.1" /><line x1="2" y1="2" x2="22" y2="22" /></>);
