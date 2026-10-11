import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getBookDetail } from "@/lib/mock/book-detail";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { CheckoutView } from "@/components/checkout/CheckoutView";

export default async function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = getBookDetail(id);
  if (!book) notFound();
  if (book.price === 0) redirect(`/books/${book.id}`);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="flex-1">
        <RequireAuth roles={["user", "seller", "admin", "super_admin"]}>
          <main className="mx-auto max-w-5xl px-6 py-10 md:py-16">
            <Link
              href={`/books/${book.id}`}
              className="mb-8 inline-flex items-center gap-2 text-sm text-muted transition-colors duration-200 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to book
            </Link>
            <CheckoutView book={book} />
          </main>
        </RequireAuth>
      </div>
      <Footer />
    </div>
  );
}