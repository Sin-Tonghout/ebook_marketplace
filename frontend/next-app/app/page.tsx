import { Hero } from "@/components/home/Hero";
import { FeaturedBook } from "@/components/home/FeaturedBook";
import { NewReleases } from "@/components/home/NewReleases";
import { CategoryBlocks } from "@/components/home/CategoryBlocks";
import { PopularAuthors } from "@/components/home/PopularAuthors";
import { PublishingCTA } from "@/components/home/PublishingCTA";
import { BookShelf } from "@/components/books/BookShelf";
import { Footer } from "@/components/layout/Footer";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { featuredBook, newReleases, trendingBooks } from "@/lib/mock/catalog";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <FeaturedBook book={featuredBook} />
        <BookShelf title="Trending books" books={trendingBooks} href="/books?sort=popular" />
        <NewReleases books={newReleases.slice(0, 8)} />
        <CategoryBlocks />
        <PopularAuthors />
        <PublishingCTA />
      </main>
      <Footer />
    </>
  );
}