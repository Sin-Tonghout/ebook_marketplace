import { notFound } from "next/navigation";
import { getBookDetail } from "@/lib/mock/book-detail";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { PurchaseFailure } from "@/components/checkout/PurchaseFailure";

export default async function PurchaseFailedPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ order?: string }>;
}) {
  const { id } = await params;
  const { order } = await searchParams;
  const book = getBookDetail(id);
  if (!book) notFound();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="flex-1">
        <RequireAuth roles={["user", "seller", "admin", "super_admin"]}>
          <main className="mx-auto max-w-5xl px-6 py-12 md:py-20">
            <PurchaseFailure book={book} orderId={order} />
          </main>
        </RequireAuth>
      </div>
      <Footer />
    </div>
  );
}