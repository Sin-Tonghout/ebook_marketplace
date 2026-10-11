import type {
  SalesPoint,
  SellerBook,
  SellerOrder,
} from "@/types/seller";

function daysAgo(n: number, hour = 10): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

function seedBase(): SellerBook[] {
  return [
    {
      id: "sb-1",
      title: "The Quiet Architecture of Habits",
      subtitle: "Designing days that hold",
      status: "published",
      price: 9.99,
      currency: "USD",
      sales: 412,
      revenue: 3680.4,
      downloads: 538,
      views: 9120,
      rating: 4.8,
      reviewCount: 96,
      updatedAt: daysAgo(3),
    },
    {
      id: "sb-2",
      title: "Letters from Tonlé Sap",
      status: "published",
      price: 6.5,
      compareAtPrice: 8.0,
      currency: "USD",
      sales: 268,
      revenue: 1612.0,
      downloads: 301,
      views: 5410,
      rating: 4.6,
      reviewCount: 52,
      updatedAt: daysAgo(8),
    },
    {
      id: "sb-3",
      title: "Typography for Storytellers",
      status: "published",
      price: 12,
      currency: "USD",
      sales: 143,
      revenue: 1612.5,
      downloads: 175,
      views: 3980,
      rating: 4.9,
      reviewCount: 31,
      updatedAt: daysAgo(14),
    },
    {
      id: "sb-4",
      title: "A Small Book of Khmer Proverbs",
      status: "pending",
      price: 0,
      currency: "USD",
      sales: 0,
      revenue: 0,
      downloads: 0,
      views: 0,
      rating: 0,
      reviewCount: 0,
      updatedAt: daysAgo(1),
    },
    {
      id: "sb-5",
      title: "Notes on Slow Cities",
      status: "rejected",
      price: 4.99,
      currency: "USD",
      sales: 0,
      revenue: 0,
      downloads: 0,
      views: 0,
      rating: 0,
      reviewCount: 0,
      updatedAt: daysAgo(5),
      rejectionReason:
        "The cover image appears to use artwork we couldn't verify you have rights to. Please replace it and resubmit.",
    },
    {
      id: "sb-6",
      title: "Unfinished: Field Guide to Night Markets",
      status: "draft",
      price: 7.5,
      currency: "USD",
      sales: 0,
      revenue: 0,
      downloads: 0,
      views: 0,
      rating: 0,
      reviewCount: 0,
      updatedAt: daysAgo(20),
    },
    {
      id: "sb-7",
      title: "Early Essays (2019)",
      status: "archived",
      price: 2.99,
      currency: "USD",
      sales: 57,
      revenue: 170.43,
      downloads: 60,
      views: 1200,
      rating: 4.1,
      reviewCount: 9,
      updatedAt: daysAgo(90),
    },
  ];
}

export function seedOrders(): SellerOrder[] {
  const rows: Array<[string, string, string, number, SellerOrder["status"], number, number]> = [
    ["EB-2026-000142", "sb-1", "Sokha P.", 9.99, "paid", 0, 9],
    ["EB-2026-000141", "sb-2", "Maya L.", 6.5, "paid", 0, 14],
    ["EB-2026-000140", "sb-1", "Dara K.", 9.99, "pending", 1, 11],
    ["EB-2026-000139", "sb-3", "Chenda S.", 12, "paid", 1, 16],
    ["EB-2026-000138", "sb-2", "Ben W.", 6.5, "failed", 2, 8],
    ["EB-2026-000137", "sb-1", "Linh T.", 9.99, "paid", 2, 19],
    ["EB-2026-000136", "sb-3", "Ravy C.", 12, "refunded", 4, 13],
    ["EB-2026-000135", "sb-2", "Alex M.", 6.5, "paid", 5, 10],
    ["EB-2026-000134", "sb-1", "Nary H.", 9.99, "paid", 6, 21],
    ["EB-2026-000133", "sb-1", "Tom R.", 9.99, "paid", 7, 15],
    ["EB-2026-000132", "sb-3", "Sreyleak D.", 12, "paid", 9, 12],
    ["EB-2026-000131", "sb-2", "Joel B.", 6.5, "paid", 11, 17],
  ];

  const titleById: Record<string, string> = {
    "sb-1": "The Quiet Architecture of Habits",
    "sb-2": "Letters from Tonlé Sap",
    "sb-3": "Typography for Storytellers",
  };

  return rows.map(([id, bookId, buyerName, amount, status, d, h]) => ({
    id,
    bookId,
    bookTitle: titleById[bookId],
    buyerName,
    amount,
    currency: "USD",
    status,
    createdAt: daysAgo(d, h),
  }));
}

// Deterministic 30-day series (no Math.random, so tests are repeatable).
export function seedSeries(): SalesPoint[] {
  const points: SalesPoint[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const idx = 29 - i;
    const sales = Math.round(2 + 3 * (1 + Math.sin(idx / 3)) + (idx % 4));
    points.push({
      date: d.toISOString().slice(0, 10),
      sales,
      revenue: Math.round(sales * 8.4 * 100) / 100,
      downloads: sales + 1 + (idx % 3),
    });
  }
  return points;
}

const DETAILS: Record<
  string,
  Pick<SellerBook, "description" | "category" | "language" | "tags" | "file">
> = {
  "sb-1": {
    description:
      "A calm, practical guide to building small routines that last, with exercises you can try in a single afternoon.",
    category: "Self-improvement",
    language: "English",
    tags: ["habits", "routine"],
    file: { name: "quiet-architecture.pdf", size: 4_200_000, format: "pdf" },
  },
  "sb-2": {
    description:
      "A collection of essays and letters written along the Tonlé Sap, about water, family and the seasons of a floating village.",
    category: "Non-fiction",
    language: "English",
    tags: ["cambodia", "essays"],
    file: { name: "tonle-sap.epub", size: 2_100_000, format: "epub" },
  },
  "sb-3": {
    description:
      "How type shapes a story on the page. A short, visual guide to choosing, pairing and setting fonts for books and long reads.",
    category: "Design",
    language: "English",
    tags: ["typography", "design"],
    file: { name: "typography-storytellers.pdf", size: 8_800_000, format: "pdf" },
  },
  "sb-4": {
    description:
      "A small, illustrated collection of Khmer proverbs with short notes on where they come from and how people use them today.",
    category: "Poetry",
    language: "Khmer",
    tags: ["proverbs"],
    file: { name: "khmer-proverbs.pdf", size: 1_300_000, format: "pdf" },
  },
  "sb-5": {
    description:
      "Walking notes from six cities that chose to move slowly, and what daily life looks like when streets are built for people.",
    category: "Non-fiction",
    language: "English",
    tags: ["cities", "travel"],
    file: { name: "slow-cities.pdf", size: 3_400_000, format: "pdf" },
  },
  "sb-6": {
    description: "",
    category: "",
    language: "English",
    tags: [],
    file: null,
  },
  "sb-7": {
    description:
      "A first set of essays from 2019 on reading, writing and learning in public. Kept for the archive, no longer on sale.",
    category: "Non-fiction",
    language: "English",
    tags: ["essays"],
    file: { name: "early-essays.pdf", size: 900_000, format: "pdf" },
  },
};

export function seedBooks(): SellerBook[] {
  return seedBase().map((b) => ({ ...b, ...DETAILS[b.id] }));
}