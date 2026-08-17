export default function MapMock({
  className = "",
  showCar = false,
}: {
  className?: string;
  showCar?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden bg-[#eef0f4] ${className}`}>
      <svg
        viewBox="0 0 400 300"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        aria-label="Map of Harare"
        role="img"
      >
        <rect width="400" height="300" fill="#eef0f4" />
        {/* park / green areas */}
        <rect x="20" y="180" width="90" height="80" rx="8" fill="#dcefdd" />
        <rect x="300" y="30" width="80" height="60" rx="8" fill="#dcefdd" />
        {/* water */}
        <ellipse cx="350" cy="250" rx="60" ry="30" fill="#d7e7f5" />
        {/* streets */}
        <g stroke="#ffffff" strokeWidth="10" strokeLinecap="round">
          <path d="M-10 80 H410" />
          <path d="M-10 160 H410" />
          <path d="M-10 240 H410" />
          <path d="M80 -10 V310" />
          <path d="M180 -10 V310" />
          <path d="M290 -10 V310" />
          <path d="M180 160 L290 60" />
        </g>
        <g stroke="#e2e5ea" strokeWidth="4">
          <path d="M-10 120 H410" />
          <path d="M130 -10 V310" />
          <path d="M240 -10 V310" />
        </g>
        {/* route */}
        <path
          d="M80 240 L80 160 L180 160 L290 60 L340 60"
          stroke="#4f46e5"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* origin */}
        <circle cx="80" cy="240" r="8" fill="#4f46e5" />
        <circle cx="80" cy="240" r="4" fill="#ffffff" />
        {/* destination */}
        <circle cx="340" cy="60" r="8" fill="#dc2626" />
        <circle cx="340" cy="60" r="4" fill="#ffffff" />
        {showCar && (
          <g transform="translate(180 160) rotate(-42)">
            <rect x="-12" y="-7" width="24" height="14" rx="4" fill="#111827" />
            <rect x="-6" y="-5" width="9" height="10" rx="2" fill="#4b5563" />
          </g>
        )}
        {/* labels */}
        <g fill="#9ca3af" fontSize="11" fontFamily="sans-serif">
          <text x="30" y="60">Avondale</text>
          <text x="200" y="130">Harare</text>
          <text x="310" y="130">Eastlea</text>
          <text x="26" y="172">Harare Gardens</text>
          <text x="300" y="25">Borrowdale</text>
        </g>
      </svg>
    </div>
  );
}
