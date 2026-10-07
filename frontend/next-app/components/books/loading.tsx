import { BooksGridSkeleton } from "@/components/books/BooksGridSkeleton";
import { Footer } from "@/components/layout/Footer";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <>
      <SiteHeader />
      <main>
        <div className="mx-auto max-w-7xl px-6 py-12 md:px-10">
          <div className="mb-10 space-y-3" aria-hidden>
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-5 w-24" />
          </div>
          <BooksGridSkeleton />
        </div>
      </main>
      <Footer />
    </>
  );
}