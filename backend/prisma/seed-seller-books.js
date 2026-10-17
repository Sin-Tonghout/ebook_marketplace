const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

// The mock seller books from the frontend, owned by seller@demo.com.
// Sales and revenue are not stored here: they are calculated from orders.
const SELLER_BOOKS = [
  {
    id: 'sb-1', status: 'published', title: 'The Quiet Architecture of Habits', subtitle: 'Designing days that hold',
    price: 9.99, category: 'Self-improvement', language: 'English', tags: ['habits', 'routine'], format: 'PDF',
    description: 'A calm, practical guide to building small routines that last, with exercises you can try in a single afternoon.',
    views: 9120, downloads: 538, rating: 4.8, reviewCount: 96, updatedDaysAgo: 3, publishedAt: '2026-02-10',
  },
  {
    id: 'sb-2', status: 'published', title: 'Letters from Tonlé Sap',
    price: 6.5, compareAtPrice: 8, category: 'Non-fiction', language: 'English', tags: ['cambodia', 'essays'], format: 'EPUB',
    description: 'A collection of essays and letters written along the Tonlé Sap, about water, family and the seasons of a floating village.',
    views: 5410, downloads: 301, rating: 4.6, reviewCount: 52, updatedDaysAgo: 8, publishedAt: '2026-03-22',
  },
  {
    id: 'sb-3', status: 'published', title: 'Typography for Storytellers',
    price: 12, category: 'Design', language: 'English', tags: ['typography', 'design'], format: 'PDF',
    description: 'How type shapes a story on the page. A short, visual guide to choosing, pairing and setting fonts for books and long reads.',
    views: 3980, downloads: 175, rating: 4.9, reviewCount: 31, updatedDaysAgo: 14, publishedAt: '2026-04-05',
  },
  {
    id: 'sb-4', status: 'pending', title: 'A Small Book of Khmer Proverbs',
    price: 0, category: 'Poetry', language: 'Khmer', tags: ['proverbs'], format: 'PDF',
    description: 'A small, illustrated collection of Khmer proverbs with short notes on where they come from and how people use them today.',
    views: 0, downloads: 0, rating: 0, reviewCount: 0, updatedDaysAgo: 1,
  },
  {
    id: 'sb-5', status: 'rejected', title: 'Notes on Slow Cities',
    price: 4.99, category: 'Non-fiction', language: 'English', tags: ['cities', 'travel'], format: 'PDF',
    description: 'Walking notes from six cities that chose to move slowly, and what daily life looks like when streets are built for people.',
    rejectionReason: "The cover image appears to use artwork we couldn't verify you have rights to. Please replace it and resubmit.",
    views: 0, downloads: 0, rating: 0, reviewCount: 0, updatedDaysAgo: 5,
  },
  {
    id: 'sb-6', status: 'draft', title: 'Unfinished: Field Guide to Night Markets',
    price: 7.5, category: '', language: 'English', tags: [], format: null, description: '',
    views: 0, downloads: 0, rating: 0, reviewCount: 0, updatedDaysAgo: 20,
  },
  {
    id: 'sb-7', status: 'archived', title: 'Early Essays (2019)',
    price: 2.99, category: 'Non-fiction', language: 'English', tags: ['essays'], format: 'PDF',
    description: 'A first set of essays from 2019 on reading, writing and learning in public. Kept for the archive, no longer on sale.',
    views: 1200, downloads: 60, rating: 4.1, reviewCount: 9, updatedDaysAgo: 90, publishedAt: '2024-01-15',
  },
];

module.exports = { SELLER_BOOKS, daysAgo };