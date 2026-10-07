import { Skeleton } from "@/components/ui/Skeleton";

export function BookCardSkeleton() {
  return (
    <div aria-hidden>
      <Skeleton className="aspect-2/3 w-full rounded-sm" />
      <div className="mt-4 space-y-2">
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-3.5 w-1/2" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
}