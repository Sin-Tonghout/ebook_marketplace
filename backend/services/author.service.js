const prisma = require('../config/db');
const { AppError } = require('../utils/response');

const toDto = (a, bookCount) => ({
  id: a.id,
  name: a.displayName,
  bio: a.bio ?? '',
  avatarUrl: a.avatarUrl ?? a.user?.avatarUrl ?? null,
  bookCount,
});

// Authors who have at least one published book, most books first.
async function listPopular(limit) {
  const rows = await prisma.author.findMany({
    where: {
      user: { status: 'active' },
      books: { some: { status: 'published' } },
    },
    include: {
      user: { select: { avatarUrl: true } },
      _count: { select: { books: { where: { status: 'published' } } } },
    },
  });

  return rows
    .map((a) => toDto(a, a._count.books))
    .sort((x, y) => y.bookCount - x.bookCount || x.name.localeCompare(y.name))
    .slice(0, limit);
}

async function getById(id) {
  const a = await prisma.author.findUnique({
    where: { id },
    include: {
      user: { select: { avatarUrl: true, status: true } },
      books: {
        where: { status: 'published' },
        orderBy: { publishedAt: 'desc' },
        select: {
          id: true,
          title: true,
          subtitle: true,
          coverUrl: true,
          price: true,
          currency: true,
          ratingAvg: true,
          ratingCount: true,
        },
      },
    },
  });

  if (!a || a.user.status === 'suspended') {
    throw new AppError(404, 'AUTHOR_NOT_FOUND', 'Author not found.');
  }

  return {
    ...toDto(a, a.books.length),
    website: a.websiteUrl ?? '',
    instagram: a.instagram ?? '',
    x: a.x ?? '',
    books: a.books.map((b) => ({
      id: b.id,
      title: b.title,
      subtitle: b.subtitle ?? undefined,
      coverUrl: b.coverUrl,
      price: Number(b.price),
      currency: b.currency,
      rating: Number(b.ratingAvg),
      ratingCount: b.ratingCount,
    })),
  };
}

module.exports = { listPopular, getById };