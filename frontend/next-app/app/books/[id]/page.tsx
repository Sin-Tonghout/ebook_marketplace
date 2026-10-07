import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { getBookDetail, getRelatedBooks } from "@/lib/mock/book-detail";
import { BookDetailHero } from "@/components/books/BookDetailHero";
import { BookDescription } from "@/components/books/BookDescription";
import { BookMetadata } from "@/components/books/BookMetadata";
import { BookAuthorSection } from "@/components/books/BookAuthorSection";
import { BookReviews } from "@/components/books/BookReviews";
import { RelatedBooks } from "@/components/books/RelatedBooks";
// Keep YOUR working header and footer imports here, for example:
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";

const BookPreview = dynamic(() =>
  import("@/components/books/BookPreview").then((m) => m.BookPreview)
);

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = getBookDetail(id);
  if (!book) notFound();

  const related = getRelatedBooks(book);

  return (
    <>
      <SiteHeader />
      <main>
        <BookDetailHero book={book} />

        <div className="mx-auto grid max-w-6xl gap-12 px-6 pb-20 md:grid-cols-[1fr_320px] md:gap-16">
          <BookDescription text={book.description} />
          <BookMetadata book={book} />
        </div>

        <div className="mx-auto max-w-4xl px-6 pb-24">
          <BookPreview pages={book.previewPages} />
        </div>

        <div className="mx-auto max-w-4xl px-6 pb-24">
          <BookAuthorSection author={book.author} currentBookId={book.id} />
        </div>

        <div className="mx-auto max-w-4xl px-6 pb-24">
          <BookReviews initialReviews={book.reviews} />
        </div>

        <div className="mx-auto max-w-6xl px-6 pb-24">
          <RelatedBooks books={related} />
        </div>
      </main>
      <Footer />
    </>
  );
}