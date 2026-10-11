"use client";

import Link from "next/link";
import { BookOpen, Clock, Flag, Receipt, Users, Wallet } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatTile, StatTileSkeleton } from "@/components/seller/StatTile";
import { ErrorState } from "@/components/ui/ErrorState";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/components/auth/AuthProvider";
import { useAdminStats } from "@/hooks/useAdminStats";

const n = (v: number) => v.toLocaleString("en-US");

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { stats, loading, error, retry } = useAdminStats();
  const firstName = user?.name?.split(" ")[0] ?? "";

  return (
    <AdminShell>
      <header>
        <h1 className="font-serif text-3xl text-foreground sm:text-4xl">
          Admin{firstName ? `, ${firstName}` : ""}
        </h1>
        <p className="mt-2 text-muted">Here's what needs attention on Folio.</p>
      </header>

      <section aria-label="Platform stats" className="mt-8">
        {error ? (
          <ErrorState
            title="We couldn't load the dashboard."
            description="Please try again."
            onRetry={retry}
            retryLabel="Retry"
          />
        ) : loading || !stats ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <StatTileSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatTile index={0} label="Users" value={n(stats.users)} icon={<Users className="size-4" />} />
            <StatTile index={1} label="Books" value={n(stats.books)} icon={<BookOpen className="size-4" />} />
            <StatTile
              index={2}
              label="Pending review"
              value={n(stats.pendingReviews)}
              hint="Waiting for a decision"
              icon={<Clock className="size-4" />}
            />
            <StatTile index={3} label="Orders" value={n(stats.orders)} icon={<Receipt className="size-4" />} />
            <StatTile index={4} label="Revenue" value={`$${n(stats.revenue)}`} icon={<Wallet className="size-4" />} />
            <StatTile
              index={5}
              label="Open reports"
              value={n(stats.openReports)}
              hint="Copyright, spam and more"
              icon={<Flag className="size-4" />}
            />
          </div>
        )}
      </section>

      {stats && !error && (
        <section
          aria-label="Needs attention"
          className="mt-10 rounded-xl border border-border bg-surface p-6"
        >
          <h2 className="font-serif text-xl text-foreground">Needs attention</h2>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Link href="/admin/books">
              <Button>Review {n(stats.pendingReviews)} pending books</Button>
            </Link>
            <Link href="/admin/reports">
              <Button variant="secondary">Open {n(stats.openReports)} reports</Button>
            </Link>
          </div>
        </section>
      )}
    </AdminShell>
  );
}