import type { BookDetail, RelatedBook } from "@/types/book-detail";
import type { Book } from "@/types/book";
import { allBooks, findBook } from "@/lib/mock/findBook";


/** Related books come from the main catalog, so every link opens a real page. */
export function getRelatedBooks(book: BookDetail, limit = 6): RelatedBook[] {
  const others = allBooks.filter((b) => b.id !== book.id);
  const sameCategory = others.filter((b) => b.category === book.category);
  const rest = others.filter((b) => b.category !== book.category);
  return [...sameCategory, ...rest].slice(0, limit).map((b) => ({
    id: b.id,
    title: b.title,
    authorName: b.author.name,
    coverUrl: b.coverUrl ?? undefined,
    price: b.price,
    currency: b.currency,
    rating: b.rating,
  }));
}

/** Hand-written extras for books that have richer content than the catalog entry. */
const extras: Record<string, Partial<BookDetail>> = {
  "1": {
    author: {
      id: "a1",
      name: "Mara Ellison",
      bio: "Mara writes quiet, character-driven fiction about attention, work, and the small rituals that hold a life together. She lives near the sea and reads mostly at night.",
      followers: 1240,
      books: [{ id: "1", title: "The Quiet Hours", price: 8.99, currency: "USD" }],
    },
    description:
      "A year in the life of a night-shift librarian who learns that the stories worth keeping are the ones we almost miss. Warm, patient, and quietly funny.\n\nFor anyone who has ever stayed up just a little too late for the quiet.",
    previewPages: [
      {
        chapter: "Chapter 1 — The Night Desk",
        text: "The library was never fully silent. At two in the morning it hummed: the old radiators, the refrigerator in the staff room, the soft settling of paper. Nora had learned to hear it the way other people learn to hear rain.\n\nShe had taken the night shift for the quiet. She stayed, she would later admit, for the visitors.",
      },
      {
        text: "Mostly they came for nothing in particular. A man who wanted the weather page from last year's newspaper. A student who had run out of places to be. Nora handed each of them something small, a book, a lamp, a minute, and wrote nothing down.",
      },
      {
        chapter: "Chapter 2 — What Gets Returned",
        text: "Books came back in strange condition. A pressed flower. A train ticket to a town she had never heard of. Once, a note that said only: thank you for not asking.\n\nShe kept a shoebox for these things, though she could not have said why.",
      },
    ],
    reviews: [
      {
        id: "r1",
        name: "Vanna P.",
        rating: 5,
        title: "Read it in one sitting",
        body: "Gentle, funny, and deeply kind. I finished it at 2 a.m. and felt exactly like the book wanted me to.",
        createdAt: "2026-08-02",
      },
      {
        id: "r2",
        name: "Rithy S.",
        rating: 4,
        title: "Slow in the best way",
        body: "Not much happens, and somehow that is the point. A few chapters could be shorter, but I loved the ending.",
        createdAt: "2026-07-19",
      },
      {
        id: "r3",
        name: "Maly K.",
        rating: 5,
        title: "A perfect bedtime book",
        body: "Warm, patient and quietly funny. Exactly as described.",
        createdAt: "2026-06-30",
      },
    ],
  },
};

/** Builds a detail page for any catalog book. */
function detailFromBook(b: Book): BookDetail {
  const sameAuthor = allBooks.filter((x) => x.author.id === b.author.id);
  return {
    id: b.id,
    title: b.title,
    subtitle: b.subtitle,
    author: {
      id: b.author.id,
      name: b.author.name,
      bio: `${b.author.name} writes about ${b.category.toLowerCase()} for curious, patient readers.`,
      followers: 0,
      books: sameAuthor.map((x) => ({
        id: x.id,
        title: x.title,
        coverUrl: x.coverUrl ?? undefined,
        price: x.price,
        currency: x.currency,
      })),
    },
    category: b.category,
    description: b.description ?? `${b.title} by ${b.author.name}.`,
    coverUrl: b.coverUrl ?? undefined,
    price: b.price,
    compareAtPrice: b.compareAtPrice,
    currency: b.currency,
    rating: b.rating,
    ratingCount: b.ratingCount,
    format: b.format,
    pages: b.pages ?? 0,
    language: b.language,
    publishedAt: b.publishedAt ?? "2026-01-01",
    previewPages: [
      {
        chapter: "Chapter 1",
        text: "Some ideas arrive quietly, and stay long after louder ones have gone.\n\nThis is a sample page. The full book opens in your library after purchase.",
      },
      {
        text: "It is easy to mistake speed for progress, and busyness for meaning. The best things are rarely made in a hurry; they are revisited, shaped and trusted.",
      },
    ],
    reviews: [],
  };
}

export function getBookDetail(id: string): BookDetail | undefined {
  const book = findBook(id);
  if (!book) return undefined;
  return { ...detailFromBook(book), ...extras[id] };
}
