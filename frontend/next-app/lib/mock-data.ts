import type { Author, Book } from "@/types/book";

export const mockAuthors: Author[] = [
  {
    id: "a1",
    name: "Sophea Chan",
    bio: "Designer and writer exploring how everyday objects shape the way we think.",
    bookCount: 4,
  },
  {
    id: "a2",
    name: "Dara Lim",
    bio: "Software engineer turned author. Writes about technology for curious beginners.",
    bookCount: 7,
  },
  {
    id: "a3",
    name: "Maya Whitfield",
    bio: "Novelist. Her quiet, character-driven stories have been translated into nine languages.",
    bookCount: 3,
  },
];

export const mockBooks: Book[] = [
    { id: "b1", title: "The Future of Design", subtitle: "Making things people keep", author: { id: "a1", name: "Sophea Chan" }, price: 12, currency: "USD", rating: 4.8, ratingCount: 214, category: "Design", language: "English", format: "EPUB", pages: 248, publishedAt: "2026-03-14", description: "A thoughtful look at why some objects, interfaces and ideas stay with us for decades while others disappear. Part field guide, part manifesto, it asks designers to build things worth keeping." },
  { id: "b2", title: "Technology for Beginners", author: { id: "a2", name: "Dara Lim" }, price: 0, currency: "USD", rating: 4.5, ratingCount: 1032, category: "Technology", language: "English", format: "PDF" },
  { id: "b3", title: "A Quiet Harbor", author: { id: "a3", name: "Maya Whitfield" }, price: 8.99, compareAtPrice: 11.99, currency: "USD", rating: 4.2, ratingCount: 87, category: "Fiction", language: "English", format: "EPUB" },
  { id: "b4", title: "Modern Technology, Explained", author: { id: "a2", name: "Dara Lim" }, price: 9.5, currency: "USD", rating: 4.0, ratingCount: 56, category: "Technology", language: "English", format: "EPUB" },
    { id: "b5", title: "The Slow Reader", subtitle: "Why fewer books change more", author: { id: "a1", name: "Sophea Chan" }, price: 6.99, currency: "USD", rating: 4.9, ratingCount: 341, category: "Self-development", language: "English", format: "EPUB", pages: 164, publishedAt: "2025-11-02", description: "An argument for reading less, but better: how attention, repetition and rest turn a single book into a lasting change." },
  { id: "b6", title: "Salt and Lantern", author: { id: "a3", name: "Maya Whitfield" }, price: 10, currency: "USD", rating: 3.8, ratingCount: 19, category: "Fiction", language: "English", format: "PDF" },
  { id: "b7", title: "Business in Plain Words", author: { id: "a2", name: "Dara Lim" }, price: 14.99, currency: "USD", rating: 4.6, ratingCount: 128, category: "Business", language: "English", format: "PDF" },
  { id: "b8", title: "Drawing the Everyday", author: { id: "a1", name: "Sophea Chan" }, price: 0, currency: "USD", rating: 4.4, ratingCount: 73, category: "Art", language: "English", format: "PDF" },
];

export const mockCategories = [
  { slug: "fiction", name: "Fiction", bookCount: 482 },
  { slug: "technology", name: "Technology", bookCount: 316 },
  { slug: "business", name: "Business", bookCount: 204 },
  { slug: "self-development", name: "Self-development", bookCount: 275 },
  { slug: "design", name: "Design & Art", bookCount: 143 },
  { slug: "children", name: "Children", bookCount: 98 },
];