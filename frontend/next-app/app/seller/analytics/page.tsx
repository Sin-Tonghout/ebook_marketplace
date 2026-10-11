"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { ArrowLeft, BarChart3, Download, ShoppingBag, Wallet } from "lucide-react";
import Link from "next/link";

import { ChartCard } from "@/components/seller/ChartCard";
import { RangeToggle, type Range } from "@/components/seller/RangeToggle";
import { SellerShell } from "@/components/seller/SellerShell";
import { StatTile, StatTileSkeleton } from "@/components/seller/StatTile";
import { TopBooksList } from "@/components/seller/TopBooksList";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useSellerData } from "@/hooks/useSellerData";
import { formatMoney, formatNumber } from "@/lib/format";

const chartSkeleton = () => <Skeleton className="h-64 w-full rounded-lg" />;

// Recharts is heavy, so load it only when this page opens
const RevenueChart = dynamic(
  () =>
    import("@/components/seller/AnalyticsCharts").then((m) => m.RevenueChart),
  { ssr: false, loading: chartSkeleton }
);
const ActivityChart = dynamic(
  () =>
    import("@/components/seller/AnalyticsCharts").then((m) => m.ActivityChart),
  { ssr: false, loading: chartSkeleton }
);

export default function SellerAnalyticsPage() {
  const router = useRouter();
  const result = useSellerData();
  const [range, setRange] = useState<Range>(30);

  if (result.status === "loading") {
    return (
      <SellerShell>
        <div aria-busy="true" className="space-y-8">
          <Skeleton className="h-9 w-48" />
          <div className="grid gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <StatTileSkeleton key={i} />
            ))}
          </div>
          <Skeleton className="h-96 w-full rounded-xl" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      </SellerShell>
    );
  }

  if (result.status === "error") {
    return (
      <SellerShell>
        <ErrorState
          title="We couldn't load your analytics"
          description="Your data is safe. Please try again."
          onRetry={result.reload}
        />
      </SellerShell>
    );
  }

  const { books, series } = result.data;

  if (books.length === 0 || series.length === 0) {
    return (
      <SellerShell>
        <EmptyState
          icon={<BarChart3 className="size-7" aria-hidden />}
          title="No analytics yet."
          description="Once your first book is live, you'll see sales, revenue and downloads here."
          action={
            <Button onClick={() => router.push("/seller/books/create")}>
              Publish your first book
            </Button>
          }
        />
      </SellerShell>
    );
  }

  const data = series.slice(-range);
  const totals = data.reduce(
    (t, p) => ({
      sales: t.sales + p.sales,
      revenue: t.revenue + p.revenue,
      downloads: t.downloads + p.downloads,
    }),
    { sales: 0, revenue: 0, downloads: 0 }
  );

  const topBooks = books
    .filter((b) => (b.status === "published" || b.status === "archived") && b.revenue > 0)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const rangeLabel = `the last ${range} days`;

  return (
    <SellerShell className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            href="/seller"
            className="type-body-sm mb-4 inline-flex items-center gap-2 text-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden /> Dashboard
          </Link>
          <h1 className="type-h2">Analytics</h1>
          <p className="mt-2 type-body text-muted">
            How your books are selling.
          </p>
        </div>
        <RangeToggle value={range} onChange={setRange} />
      </header>

      <section aria-label="Summary" className="grid gap-4 sm:grid-cols-3">
        <StatTile
          index={0}
          label="Revenue"
          value={formatMoney(totals.revenue)}
          hint={`USD · ${rangeLabel}`}
          icon={<Wallet className="size-4" />}
        />
        <StatTile
          index={1}
          label="Sales"
          value={formatNumber(totals.sales)}
          hint={rangeLabel}
          icon={<ShoppingBag className="size-4" />}
        />
        <StatTile
          index={2}
          label="Downloads"
          value={formatNumber(totals.downloads)}
          hint={rangeLabel}
          icon={<Download className="size-4" />}
        />
      </section>

      <ChartCard
        title="Revenue over time"
        description={`${formatMoney(totals.revenue)} earned in ${rangeLabel}.`}
      >
        <RevenueChart
          data={data}
          summary={`Revenue per day for ${rangeLabel}, ${formatMoney(totals.revenue)} in total.`}
        />
      </ChartCard>

      <ChartCard
        title="Sales and downloads"
        description={`${formatNumber(totals.sales)} sold and ${formatNumber(totals.downloads)} downloaded in ${rangeLabel}.`}
      >
        <ActivityChart
          data={data}
          summary={`Sales and downloads per day for ${rangeLabel}: ${formatNumber(totals.sales)} sales and ${formatNumber(totals.downloads)} downloads in total.`}
        />
      </ChartCard>

      <ChartCard
        title="Top books"
        description="Ranked by all-time revenue."
      >
        {topBooks.length === 0 ? (
          <p className="type-body text-muted">
            Your best sellers will appear here once a book makes its first sale.
          </p>
        ) : (
          <TopBooksList books={topBooks} />
        )}
      </ChartCard>
    </SellerShell>
  );
}