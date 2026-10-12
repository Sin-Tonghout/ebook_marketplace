// The mock catalog from the frontend, ported so the database starts with the
// same books. Ids match the mock ids ("1".."8", "a1".."a8") on purpose.

const AUTHORS = [
  {
    id: 'a1',
    name: 'Mara Ellison',
    bio: 'Mara writes quiet, character-driven fiction about attention, work, and the small rituals that hold a life together. She lives near the sea and reads mostly at night.',
  },
  { id: 'a2', name: 'Daniel Reyes', bio: 'Daniel Reyes writes about design for curious, patient readers.' },
  { id: 'a3', name: 'Anika Rao', bio: 'Anika Rao writes about science for curious, patient readers.' },
  { id: 'a4', name: 'Mina Park', bio: 'Mina Park writes about technology for curious, patient readers.' },
  { id: 'a5', name: 'Arjun Rao', bio: 'Arjun Rao writes about history for curious, patient readers.' },
  { id: 'a6', name: 'Tom Haverly', bio: 'Tom Haverly writes about design for curious, patient readers.' },
  { id: 'a7', name: 'Sophea Lim', bio: 'Sophea Lim writes about business for curious, patient readers.' },
  { id: 'a8', name: 'Isla Moreno', bio: 'Isla Moreno writes about fiction for curious, patient readers.' },
];

const BOOKS = [
  {
    id: '1', authorId: 'a1', category: 'Fiction', title: 'The Quiet Hours', subtitle: 'A novel about attention',
    price: 8.99, compareAtPrice: 12.99, rating: 4.7, ratingCount: 312, format: 'EPUB', pages: 284, publishedAt: '2026-03-14',
    description:
      'A year in the life of a night-shift librarian who learns that the stories worth keeping are the ones we almost miss. Warm, patient, and quietly funny.\n\nFor anyone who has ever stayed up just a little too late for the quiet.',
  },
  {
    id: '2', authorId: 'a2', category: 'Design', title: 'Paper Cities',
    price: 12, rating: 4.5, ratingCount: 198, format: 'PDF', pages: 220, publishedAt: '2026-05-02',
    description: 'How cities are drawn, folded, and imagined on paper.',
  },
  {
    id: '3', authorId: 'a3', category: 'Science', title: 'Slow Light',
    price: 6.5, rating: 4.8, ratingCount: 441, format: 'EPUB', pages: 180, publishedAt: '2026-01-20',
    description: 'A gentle introduction to how light travels, bends, and slows.',
  },
  {
    id: '4', authorId: 'a4', category: 'Technology', title: 'Notes on Calm Software',
    price: 14.99, rating: 4.6, ratingCount: 87, format: 'PDF', pages: 156, publishedAt: '2026-08-11',
  },
  {
    id: '5', authorId: 'a5', category: 'History', title: 'The Slow Library',
    price: 0, rating: 4.2, ratingCount: 56, format: 'EPUB', pages: 240, publishedAt: '2026-09-03',
  },
  {
    id: '6', authorId: 'a6', category: 'Design', title: 'A Field Guide to Typography',
    price: 18, compareAtPrice: 24, rating: 4.9, ratingCount: 603, format: 'PDF', pages: 310, publishedAt: '2025-11-27',
  },
  {
    id: '7', authorId: 'a7', category: 'Business', title: 'Letters to a Young Maker',
    price: 9.5, rating: 4.4, ratingCount: 129, format: 'EPUB', pages: 198, publishedAt: '2026-06-18',
  },
  {
    id: '8', authorId: 'a8', category: 'Fiction', title: "The Cartographer's Daughter",
    price: 7.25, rating: 4.3, ratingCount: 245, format: 'EPUB', pages: 352, publishedAt: '2026-09-21',
  },
];

// Preview pages: { chapter?, text }. Books without an entry get GENERIC_PREVIEW.
const PREVIEWS = {
  '1': [
    {
      chapter: 'Chapter 1 — The Night Desk',
      text: "The library was never fully silent. At two in the morning it hummed: the old radiators, the refrigerator in the staff room, the soft settling of paper. Nora had learned to hear it the way other people learn to hear rain.\n\nShe had taken the night shift for the quiet. She stayed, she would later admit, for the visitors.",
    },
    {
      text: "Mostly they came for nothing in particular. A man who wanted the weather page from last year's newspaper. A student who had run out of places to be. Nora handed each of them something small, a book, a lamp, a minute, and wrote nothing down.",
    },
    {
      chapter: 'Chapter 2 — What Gets Returned',
      text: 'Books came back in strange condition. A pressed flower. A train ticket to a town she had never heard of. Once, a note that said only: thank you for not asking.\n\nShe kept a shoebox for these things, though she could not have said why.',
    },
  ],
};

const GENERIC_PREVIEW = [
  {
    chapter: 'Chapter 1',
    text: 'Some ideas arrive quietly, and stay long after louder ones have gone.\n\nThis is a sample page. The full book opens in your library after purchase.',
  },
  {
    text: 'It is easy to mistake speed for progress, and busyness for meaning. The best things are rarely made in a hurry; they are revisited, shaped and trusted.',
  },
];

// Reviewers are demo reader accounts (they cannot sign in).
const REVIEWS = [
  {
    bookId: '1', email: 'vanna@readers.demo', name: 'Vanna P.', rating: 5, createdAt: '2026-08-02',
    title: 'Read it in one sitting',
    body: 'Gentle, funny, and deeply kind. I finished it at 2 a.m. and felt exactly like the book wanted me to.',
  },
  {
    bookId: '1', email: 'rithy@readers.demo', name: 'Rithy S.', rating: 4, createdAt: '2026-07-19',
    title: 'Slow in the best way',
    body: 'Not much happens, and somehow that is the point. A few chapters could be shorter, but I loved the ending.',
  },
  {
    bookId: '1', email: 'maly@readers.demo', name: 'Maly K.', rating: 5, createdAt: '2026-06-30',
    title: 'A perfect bedtime book',
    body: 'Warm, patient and quietly funny. Exactly as described.',
  },
];

module.exports = { AUTHORS, BOOKS, PREVIEWS, GENERIC_PREVIEW, REVIEWS };