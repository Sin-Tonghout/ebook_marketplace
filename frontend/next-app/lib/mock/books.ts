export type MockBook = {
  id: string;
  title: string;
  author: string;
  price: number;
  rating: number;
  cover: string; // path under /public/covers
  color: string; // fallback color if the image is missing
};

export const heroBooks: MockBook[] = [
  { id: "1", title: "The Quiet Hours", author: "Mara Ellison", price: 8.99, rating: 4.7, cover: "/covers/book-1.jpg", color: "#1F2A24" },
  { id: "2", title: "Paper Cities", author: "Daniel Reyes", price: 12.0, rating: 4.5, cover: "/covers/book-2.jpg", color: "#C98B5B" },
  { id: "3", title: "Slow Light", author: "Anika Rao", price: 6.5, rating: 4.8, cover: "/covers/book-3.jpg", color: "#557A61" },
];