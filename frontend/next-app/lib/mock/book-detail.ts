// import type { BookDetail } from "@/types/book-detail";
import type { BookDetail, RelatedBook } from "@/types/book-detail";

const relatedPool: (RelatedBook & { category: string })[] = [
  { id: "1", title: "The Future of Design", authorName: "Sokha Chan", category: "Design", price: 12, currency: "USD", rating: 4.6 },
  { id: "2", title: "Quiet Pages", authorName: "Dara Meas", category: "Non-fiction", price: 0, currency: "USD", rating: 4.2 },
  { id: "3", title: "Type in Motion", authorName: "Sokha Chan", category: "Design", price: 9.99, currency: "USD", rating: 4.8 },
  { id: "4", title: "Systems of Color", authorName: "Linda Rath", category: "Design", price: 14.5, currency: "USD", rating: 4.4 },
  { id: "5", title: "The Slow Library", authorName: "Dara Meas", category: "Non-fiction", price: 7.5, currency: "USD", rating: 4.1 },
  { id: "6", title: "Notes on Attention", authorName: "Vireak Sou", category: "Non-fiction", price: 5, currency: "USD", rating: 4.5 },
  { id: "7", title: "Interface Fundamentals", authorName: "Linda Rath", category: "Design", price: 18, currency: "USD", rating: 4.7 },
];

export function getRelatedBooks(book: BookDetail, limit = 6): RelatedBook[] {
  const others = relatedPool.filter((b) => b.id !== book.id);
  const sameCategory = others.filter((b) => b.category === book.category);
  const rest = others.filter((b) => b.category !== book.category);
  return [...sameCategory, ...rest]
    .slice(0, limit)
    .map(({ category: _category, ...b }) => b);
}
const books: BookDetail[] = [
  {
    id: "1",
    title: "The Future of Design",
    subtitle: "Craft, systems, and the next decade of interfaces",
    // book "1"
    author: {
      id: "a1",
      name: "Sokha Chan",
      bio: "Sokha is a product designer and writer based in Phnom Penh. She writes about design systems, motion, and the quiet details that make software feel considered.",
      followers: 1240,
      books: [
        { id: "1", title: "The Future of Design", price: 12, currency: "USD" },
        { id: "2", title: "Quiet Pages", price: 0, currency: "USD" },
      ],
    },
    category: "Design",
    description:
      "A calm, practical look at where design is heading. Through essays and case studies, the book explores how systems thinking, motion, and typography shape the products people love.\n\nWritten for designers, developers, and anyone who cares about how things feel.",
    price: 12,
    currency: "USD",
    rating: 4.6,
    ratingCount: 238,
    format: "EPUB",
    pages: 264,
    language: "English",
    publishedAt: "2026-03-14",
    // inside book "1"
    previewPages: [
      {
        chapter: "Chapter 1 — Why Systems Matter",
        text: "Every interface begins as a handful of decisions. A color, a type size, a spacing value. On their own they are small. Together, and repeated with care, they become a language that people learn without noticing.\n\nThis chapter looks at how that language forms, and why the teams who treat it as a product, not a style guide, ship work that feels inevitable.",
      },
      {
        text: "Consider the last tool you loved using. Chances are you cannot name a single feature that made it feel good. What you remember is the absence of friction: buttons that behaved, motion that explained, text you could read for an hour.\n\nThat feeling is designed, and it can be taught.",
      },
      {
        chapter: "Chapter 2 — Motion as Meaning",
        text: "Animation is often described as polish. In practice it is information. A panel that slides in from the right tells you where it lives. A card that lifts slightly tells you it can be pressed.\n\nThe rule is simple: if a movement cannot answer what changed, it should not exist.",
      },
    ],
    // book "1"
    reviews: [
      {
        id: "r1",
        name: "Vanna P.",
        rating: 5,
        title: "Changed how I think about motion",
        body: "Clear, practical, and beautifully written. The chapter on motion as information is worth the price alone.",
        createdAt: "2026-08-02",
      },
      {
        id: "r2",
        name: "Rithy S.",
        rating: 4,
        title: "Great for teams",
        body: "I shared this with my whole design team. A few chapters felt short, but the ideas are solid.",
        createdAt: "2026-07-19",
      },
      {
        id: "r3",
        name: "Maly K.",
        rating: 5,
        title: "Calm and thoughtful",
        body: "Reads like a long conversation with a very good designer.",
        createdAt: "2026-06-30",
      },
    ],
  },
  {
    id: "2",
    title: "Quiet Pages",
    subtitle: "A short guide to reading deeply",
    // book "2"
    author: {
      id: "a2",
      name: "Dara Meas",
      bio: "Dara writes short, practical books about reading, attention, and building habits that last.",
      followers: 612,
      books: [{ id: "2", title: "Quiet Pages", price: 0, currency: "USD" }],
    },
    category: "Non-fiction",
    description:
      "A short book about attention, slow reading, and building a library that lasts.",
    price: 0,
    currency: "USD",
    rating: 4.2,
    ratingCount: 86,
    format: "PDF",
    pages: 112,
    language: "English",
    publishedAt: "2026-01-08",
    // inside book "2"
    previewPages: [
      {
        chapter: "Introduction",
        text: "Reading deeply is a skill, and like any skill it fades without use. This short guide offers a few habits for getting it back: one book at a time, a consistent place, and a screen that stays out of your way.",
      },
      {
        text: "Start small. Ten pages, no notifications, a warm light. The goal is not speed. The goal is to remember what it felt like to be absorbed.",
      },
    ],
    reviews: [],
  },
];

export function getBookDetail(id: string): BookDetail | undefined {
  return books.find((b) => b.id === id);
}
