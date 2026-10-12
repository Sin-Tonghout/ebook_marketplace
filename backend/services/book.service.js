const prisma = require('../config/db');
const { AppError } = require('../utils/response');

const isoDate = (d) => d.toISOString().slice(0, 10);

// Books by suspended authors are hidden from the public.
const publicWhere = { status: 'published', author: { user: { status: 'active' } } };

const ORDER = {
  newest: [{ publishedAt: 'desc' }, { id: 'asc' }],
  popular: [{ ratingCount: 'desc' }, { id: 'asc' }],
  rating: [{ ratingAvg: 'desc' }, { ratingCount: 'desc' }, { id: 'asc' }],
  'price-asc': [{ price: 'asc' }, { id: 'asc' }],
  'price-desc': [{ price: 'desc' }, { id: 'asc' }],
};

const listInclude = {
  author: { select: { id: true, displayName: true } },
  category: { select: { name: true } },
};

// Database row -> the Book shape the frontend uses (types/book.ts).
function toBookDto(b) {
  return {
    id: b.id,
    title: b.title,
    ...(b.subtitle ? { subtitle: b.subtitle } : {}),
    author: { id: b.author.id, name: b.author.displayName },
    coverUrl: b.coverUrl ?? null,
    price: Number(b.price),
    ...(b.compareAtPrice != null ? { compareAtPrice: Number(b.compareAtPrice) } : {}),
    currency: b.currency,
    rating: Number(b.ratingAvg),
    ratingCount: b.ratingCount,
    category: b.category?.name ?? 'Uncategorized',
    language: b.language,
    format: b.format ?? 'PDF',
    ...(b.description ? { description: b.description } : {}),
    ...(b.pages ? { pages: b.pages } : {}),
    ...(b.publishedAt ? { publishedAt: isoDate(b.publishedAt) } : {}),
  };
}

async function list({ q, category, sort, page, pageSize }) {
  const where = { ...publicWhere };
  if (category) where.category = { slug: category };
  if (q) {
    where.OR = [
      { title: { contains: q } },
      { subtitle: { contains: q } },
      { author: { displayName: { contains: q } } },
      { category: { name: { contains: q } } },
    ];
  }

  const total = await prisma.book.count({ where });
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, pageCount);

  const rows = await prisma.book.findMany({
    where,
    orderBy: ORDER[sort],
    skip: (safePage - 1) * pageSize,
    take: pageSize,
    include: listInclude,
  });

  return { books: rows.map(toBookDto), total, page: safePage, pageCount };
}

// Same category first, then everything else.
async function getRelated(book, limit = 6) {
  const select = {
    id: true,
    title: true,
    coverUrl: true,
    price: true,
    currency: true,
    ratingAvg: true,
    author: { select: { displayName: true } },
  };

  const same = book.categoryId
    ? await prisma.book.findMany({
        where: { ...publicWhere, id: { not: book.id }, categoryId: book.categoryId },
        orderBy: [{ ratingCount: 'desc' }, { id: 'asc' }],
        take: limit,
        select,
      })
    : [];

  let rows = same;
  if (rows.length < limit) {
    const rest = await prisma.book.findMany({
      where: {
        ...publicWhere,
        id: { notIn: [book.id, ...same.map((s) => s.id)] },
      },
      orderBy: [{ ratingCount: 'desc' }, { id: 'asc' }],
      take: limit - rows.length,
      select,
    });
    rows = [...same, ...rest];
  }

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    authorName: r.author.displayName,
    ...(r.coverUrl ? { coverUrl: r.coverUrl } : {}),
    price: Number(r.price),
    currency: r.currency,
    rating: Number(r.ratingAvg),
  }));
}

// Returns { book, related } where book matches types/book-detail.ts.
async function getDetail(id) {
  const b = await prisma.book.findFirst({
    where: { ...publicWhere, id },
    include: {
      author: { include: { user: { select: { avatarUrl: true } } } },
      category: true,
      previews: { orderBy: { position: 'asc' } },
      reviews: {
        orderBy: { createdAt: 'desc' },
        take: 20,
        include: { user: { select: { name: true } } },
      },
    },
  });
  if (!b) throw new AppError(404, 'BOOK_NOT_FOUND', 'Book not found.');

  const authorBooks = await prisma.book.findMany({
    where: { ...publicWhere, authorId: b.authorId },
    orderBy: [{ publishedAt: 'desc' }, { id: 'asc' }],
    select: { id: true, title: true, coverUrl: true, price: true, currency: true },
  });

  const avatar = b.author.avatarUrl ?? b.author.user.avatarUrl;

  const book = {
    id: b.id,
    title: b.title,
    ...(b.subtitle ? { subtitle: b.subtitle } : {}),
    author: {
      id: b.author.id,
      name: b.author.displayName,
      bio: b.author.bio ?? '',
      ...(avatar ? { avatarUrl: avatar } : {}),
      followers: 0, // there is no follow feature in the database yet
      books: authorBooks.map((x) => ({
        id: x.id,
        title: x.title,
        ...(x.coverUrl ? { coverUrl: x.coverUrl } : {}),
        price: Number(x.price),
        currency: x.currency,
      })),
    },
    category: b.category?.name ?? 'Uncategorized',
    description: b.description || `${b.title} by ${b.author.displayName}.`,
    ...(b.coverUrl ? { coverUrl: b.coverUrl } : {}),
    price: Number(b.price),
    ...(b.compareAtPrice != null ? { compareAtPrice: Number(b.compareAtPrice) } : {}),
    currency: b.currency,
    rating: Number(b.ratingAvg),
    ratingCount: b.ratingCount,
    format: b.format ?? 'PDF',
    pages: b.pages ?? 0,
    language: b.language,
    publishedAt: isoDate(b.publishedAt ?? b.createdAt),
    previewPages: b.previews.map((p) => ({
      ...(p.title ? { chapter: p.title } : {}),
      text: p.content,
    })),
    reviews: b.reviews.map((r) => ({
      id: r.id,
      name: r.user.name,
      rating: r.rating,
      title: r.title ?? '',
      body: r.body,
      createdAt: isoDate(r.createdAt),
    })),
  };

  return { book, related: await getRelated(b) };
}

module.exports = { list, getDetail };