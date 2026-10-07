// Colors are fixed artwork colors (same idea as book covers), so they stay
// the same in light and dark mode.
export interface HomeCategory {
  slug: string;
  name: string;
  bookCount: number;
  bg: string;
  fg: string;
  featured?: boolean;
}

export const homeCategories: HomeCategory[] = [
  { slug: "fiction", name: "Fiction", bookCount: 482, bg: "#1F2A24", fg: "#F4F1EA", featured: true },
  { slug: "design", name: "Design", bookCount: 214, bg: "#C98B5B", fg: "#1B1D1B" },
  { slug: "technology", name: "Technology", bookCount: 356, bg: "#E9D8C8", fg: "#1F2A24" },
  { slug: "science", name: "Science", bookCount: 190, bg: "#557A61", fg: "#F7F5F0" },
  { slug: "history", name: "History", bookCount: 167, bg: "#493A2F", fg: "#E9D8C8" },
];