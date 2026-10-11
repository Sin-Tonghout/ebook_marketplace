"use client";

import { useRouter } from "next/navigation";
import {
  BookOpen,
  Download,
  Plus,
  ShoppingBag,
  Star,
  Wallet,
} from "lucide-react";

import { useAuth } from "@/components/auth/AuthProvider";
import { BestBookCard } from "@/components/seller/BestBookCard";
import { SellerShell } from "@/components/seller/SellerShell";
import {
  StatTile,
  StatTileSkeleton,
} from "@/components/seller/StatTile";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useSellerData } from "@/hooks/useSellerData";
import { formatMoney, formatNumber } from "@/lib/format";
import { computeSellerStats } from "@/lib/seller-stats";
import { STATUS_LABEL, STATUS_ORDER } from "@/lib/seller-status";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

// const STATUS_LABEL: Record<SellerBookStatus, string> = {
//   published: "Published",
//   pending: "In review",
//   draft: "Draft",
//   rejected: "Rejected",
//   archived: "Archived",
// };

// const STATUS_ORDER: SellerBookStatus[] = [
//   "published",
//   "pending",
//   "rejected",
//   "draft",
//   "archived",
// ];

export default function SellerDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const result = useSellerData();

  const firstName = (user?.name ?? "").split(" ")[0];

  if (result.status === "loading") {
    return (
      <SellerShell>
        <div aria-busy="true" className="space-y-8">
          <div className="space-y-3">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-5 w-80 max-w-full" />
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <StatTileSkeleton
                key={i}
                className="last:col-span-2 lg:last:col-span-1"
              />
            ))}
          </div>
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </SellerShell>
    );
  }

  if (result.status === "error") {
    return (
      <SellerShell>
        <ErrorState
          title="We couldn't load your dashboard"
          description="Your books are safe. Please try again."
          onRetry={result.reload}
        />
      </SellerShell>
    );
  }

  const { books } = result.data;

  if (books.length === 0) {
    return (
      <SellerShell>
        <EmptyState
          icon={<BookOpen className="size-7" aria-hidden />}
          title="You haven't published a book yet."
          description="Your sales, downloads and ratings will show up here once your first book is live."
          action={
            <Button onClick={() => router.push("/seller/books/create")}>
              Publish your first book
            </Button>
          }
        />
      </SellerShell>
    );
  }

  const stats = computeSellerStats(books);
  const statusCounts = STATUS_ORDER.map((status) => ({
    status,
    count: books.filter((b) => b.status === status).length,
  })).filter((s) => s.count > 0);

  return (
    <SellerShell className="space-y-10">
      <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="type-h2">
            {greeting()}
            {firstName ? `, ${firstName}` : ""}
          </h1>
          <p className="mt-2 type-body text-muted">
            Here&apos;s how your books are doing.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => router.push("/seller/books/create")}>
            <Plus className="size-4" aria-hidden /> Publish a book
          </Button>
          <Button
            variant="secondary"
            onClick={() => router.push("/seller/books")}
          >
            My books
          </Button>
          <Button
            variant="secondary"
            onClick={() => router.push("/seller/analytics")}
          >
            Analytics
          </Button>
        </div>
      </header>

      <section aria-label="Overview" className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatTile
          index={0}
          label="Books"
          value={formatNumber(stats.books)}
          icon={<BookOpen className="size-4" />}
        />
        <StatTile
          index={1}
          label="Sales"
          value={formatNumber(stats.sales)}
          icon={<ShoppingBag className="size-4" />}
        />
        <StatTile
          index={2}
          label="Downloads"
          value={formatNumber(stats.downloads)}
          icon={<Download className="size-4" />}
        />
        <StatTile
          index={3}
          label="Revenue"
          value={formatMoney(stats.revenue)}
          hint="USD"
          icon={<Wallet className="size-4" />}
        />
        <StatTile
          index={4}
          label="Rating"
          value={stats.rating > 0 ? stats.rating.toFixed(1) : "—"}
          hint={stats.rating > 0 ? "Average across books" : "No reviews yet"}
          icon={<Star className="size-4" />}
          className="col-span-2 lg:col-span-1"
        />
      </section>

      {stats.bestBook ? (
        <BestBookCard
  book={stats.bestBook}
  authorName={user?.name ?? "You"}
/>
      ) : (
        <EmptyState
          title="No published books yet"
          description="Once a book is approved and published, your best performer will appear here."
        />
      )}

      <section aria-labelledby="status-heading">
        <h2 id="status-heading" className="type-h4">
          Your books by status
        </h2>
        <ul className="mt-4 flex flex-wrap gap-3">
          {statusCounts.map(({ status, count }) => (
            <li key={status}>
              <Badge variant={status} dot>
                {STATUS_LABEL[status]} · {count}
              </Badge>
            </li>
          ))}
        </ul>
      </section>
    </SellerShell>
  );
}