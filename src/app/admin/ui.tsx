export function PageHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-[22px] font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-0.5 text-[13.5px] text-sub">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

export function Panel({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-xl border border-line bg-white ${className}`}>
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "bad" | "warn" | "good";
}) {
  const toneClass = {
    default: "text-ink",
    bad: "text-bad",
    warn: "text-warn",
    good: "text-good",
  }[tone];

  return (
    <Panel className="px-5 py-4">
      <div className="text-[12.5px] font-medium text-sub">{label}</div>
      <div className={`mt-1 text-[24px] font-bold leading-tight ${toneClass}`}>
        {value}
      </div>
      {hint && <div className="mt-1 text-[11.5px] text-faint">{hint}</div>}
    </Panel>
  );
}

export function StatusPill({
  tone,
  children,
}: {
  tone: "good" | "bad" | "warn" | "brand" | "neutral";
  children: React.ReactNode;
}) {
  const tones = {
    good: "bg-good-soft text-good",
    bad: "bg-bad-soft text-bad",
    warn: "bg-warn-soft text-warn",
    brand: "bg-brand-soft text-brand",
    neutral: "bg-page text-sub",
  } as const;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function Table({
  columns,
  children,
}: {
  columns: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-[13.5px]">
        <thead>
          <tr className="border-b border-line text-[11.5px] font-semibold uppercase tracking-wide text-faint">
            {columns.map((c) => (
              <th key={c} className="whitespace-nowrap px-5 py-3 font-semibold">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">{children}</tbody>
      </table>
    </div>
  );
}

export function Td({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <td className={`whitespace-nowrap px-5 py-3.5 ${className}`}>{children}</td>;
}
