"use client";

import { useReducedMotion } from "motion/react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartTooltip } from "@/components/seller/ChartTooltip";
import { formatMoney, formatNumber } from "@/lib/format";
import type { SalesPoint } from "@/types/seller";

// Colors come from Tailwind theme classes (not raw CSS vars), so they
// follow light/dark mode like the rest of the app.
const chartTheme = [
  "text-accent",
  "[&_.recharts-cartesian-grid_line]:stroke-border",
  "[&_.recharts-cartesian-axis-tick-value]:fill-muted",
  "[&_.recharts-tooltip-cursor]:stroke-border",
].join(" ");

const tick = { fontSize: 12 };

function shortDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function longDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function RevenueChart({
  data,
  summary,
}: {
  data: SalesPoint[];
  summary: string;
}) {
  const reduce = useReducedMotion();

  return (
    <div
      role="img"
      aria-label={summary}
      className={`h-64 w-full ${chartTheme} [&_.recharts-area-curve]:stroke-accent`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                style={{ stopColor: "currentColor", stopOpacity: 0.35 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "currentColor", stopOpacity: 0 }}
              />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={shortDate}
            tick={tick}
            tickLine={false}
            axisLine={false}
            minTickGap={24}
          />
          <YAxis
            tick={tick}
            tickLine={false}
            axisLine={false}
            width={48}
            tickFormatter={(v: number) => `$${formatNumber(v)}`}
          />
          <Tooltip
            content={
              <ChartTooltip
                formatLabel={longDate}
                formatValue={(_, v) => formatMoney(v)}
              />
            }
          />
          <Area
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            strokeWidth={2}
            fill="url(#revenueFill)"
            isAnimationActive={!reduce}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ActivityChart({
  data,
  summary,
}: {
  data: SalesPoint[];
  summary: string;
}) {
  const reduce = useReducedMotion();

  return (
    <div>
      <ul className="mb-4 flex gap-5 type-body-sm text-muted">
        <li className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-accent" aria-hidden />
          Sales
        </li>
        <li className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-primary" aria-hidden />
          Downloads
        </li>
      </ul>

      <div
        role="img"
        aria-label={summary}
        className={`h-64 w-full ${chartTheme} [&_.sales_.recharts-line-curve]:stroke-accent [&_.downloads_.recharts-line-curve]:stroke-primary`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={shortDate}
              tick={tick}
              tickLine={false}
              axisLine={false}
              minTickGap={24}
            />
            <YAxis
              tick={tick}
              tickLine={false}
              axisLine={false}
              width={32}
              allowDecimals={false}
            />
            <Tooltip
              content={
                <ChartTooltip
                  formatLabel={longDate}
                  formatValue={(_, v) => formatNumber(v)}
                />
              }
            />
            <Line
              className="sales"
              type="monotone"
              dataKey="sales"
              name="Sales"
              strokeWidth={2}
              dot={false}
              isAnimationActive={!reduce}
            />
            <Line
              className="downloads"
              type="monotone"
              dataKey="downloads"
              name="Downloads"
              strokeWidth={2}
              strokeDasharray="5 4"
              dot={false}
              isAnimationActive={!reduce}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}