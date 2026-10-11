interface TooltipItem {
  name?: string | number;
  value?: unknown;
}

export interface ChartTooltipProps {
  active?: boolean;
  payload?: ReadonlyArray<TooltipItem>;
  label?: string | number;
  formatLabel?: (label: string) => string;
  formatValue?: (name: string, value: number) => string;
}

const DOT: Record<string, string> = {
  Revenue: "bg-accent",
  Sales: "bg-accent",
  Downloads: "bg-primary",
};

export function ChartTooltip({
  active,
  payload,
  label,
  formatLabel,
  formatValue,
}: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  const heading = formatLabel ? formatLabel(String(label)) : String(label ?? "");

  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground shadow-lg">
      <p className="type-caption text-muted">{heading}</p>
      <ul className="mt-1 space-y-0.5">
        {payload.map((p) => {
          const name = String(p.name ?? "");
          const value = Number(p.value);
          return (
            <li key={name} className="flex items-center gap-2">
              <span
                className={`size-2 rounded-full ${DOT[name] ?? "bg-muted"}`}
                aria-hidden
              />
              <span className="text-muted">{name}</span>
              <span className="font-medium">
                {formatValue ? formatValue(name, value) : value}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}