const prisma = require('../config/db');
const { AppError } = require('../utils/response');
const { completenessProblem } = require('../validators/seller.validator');
const uploads = require('./upload.service');

// ---------------------------------------------------------------------------
// Seller profile
// ---------------------------------------------------------------------------

// Database row -> the SellerPublicProfile shape the frontend uses.
const toProfile = (a) => ({
  displayName: a.displayName,
  bio: a.bio ?? '',
  website: a.websiteUrl ?? '',
  instagram: a.instagram ?? '',
  x: a.x ?? '',
});

// Returns null when the user has no seller profile yet.
async function getProfile(userId) {
  const author = await prisma.author.findUnique({ where: { userId } });
  return author ? toProfile(author) : null;
}

async function requireAuthor(userId) {
  const author = await prisma.author.findUnique({ where: { userId } });
  if (!author) {
    throw new AppError(403, 'NOT_A_SELLER', 'Create a seller profile first.');
  }
  return author;
}

async function saveProfile(userId, input) {
  await requireAuthor(userId);

  const updated = await prisma.author.update({
    where: { userId },
    data: {
      displayName: input.displayName,
      bio: input.bio || null,
      websiteUrl: input.website || null,
      instagram: input.instagram || null,
      x: input.x || null,
    },
  });
  return toProfile(updated);
}

// ---------------------------------------------------------------------------
// Seller books
// ---------------------------------------------------------------------------

const sellerBookInclude = {
  author: { select: { displayName: true } },
  category: { select: { name: true } },
  tags: { include: { tag: true } },
  file: true,
};

// Sales come from completed orders. Revenue only adds USD items for now.
// KHR sales are counted but not converted yet.
async function salesByBook(bookIds) {
  const map = new Map();
  if (bookIds.length === 0) return map;

  const rows = await prisma.orderItem.groupBy({
    by: ['bookId', 'currency'],
    where: { bookId: { in: bookIds }, order: { status: 'completed' } },
    _count: { _all: true },
    _sum: { price: true },
  });

  for (const r of rows) {
    const cur = map.get(r.bookId) ?? { sales: 0, revenue: 0 };
    cur.sales += r._count._all;
    if (r.currency === 'USD') cur.revenue += Number(r._sum.price ?? 0);
    map.set(r.bookId, cur);
  }
  return map;
}

// Database row -> the SellerBook shape the frontend uses (types/seller.ts).
function toSellerBook(b, sold) {
  const s = sold.get(b.id) ?? { sales: 0, revenue: 0 };
  return {
    id: b.id,
    title: b.title,
    ...(b.subtitle ? { subtitle: b.subtitle } : {}),
    ...(b.coverUrl ? { coverUrl: b.coverUrl } : {}),
    status: b.status,
    price: Number(b.price),
    ...(b.compareAtPrice != null ? { compareAtPrice: Number(b.compareAtPrice) } : {}),
    currency: b.currency,
    sales: s.sales,
    revenue: Math.round(s.revenue * 100) / 100,
    downloads: b.downloads,
    views: b.views,
    rating: Number(b.ratingAvg),
    reviewCount: b.ratingCount,
    updatedAt: b.updatedAt.toISOString(),
    ...(b.description ? { description: b.description } : {}),
    ...(b.category ? { category: b.category.name } : {}),
    language: b.language,
    tags: b.tags.map((t) => t.tag.name),
    file: b.file
      ? {
          name: b.file.originalName,
          size: b.file.sizeBytes,
          format: b.file.format.toLowerCase(),
        }
      : null,
    ...(b.rejectionReason ? { rejectionReason: b.rejectionReason } : {}),
    authorName: b.author.displayName,
    ...(b.rightsBasis
      ? {
          rights: {
            basis: b.rightsBasis,
            details: b.rightsDetails ?? '',
            confirmedAt: b.rightsConfirmedAt ? b.rightsConfirmedAt.toISOString() : null,
          },
        }
      : {}),
  };
}

async function listBooks(userId) {
  const author = await prisma.author.findUnique({ where: { userId } });
  if (!author) return [];

  const rows = await prisma.book.findMany({
    where: { authorId: author.id },
    orderBy: { updatedAt: 'desc' },
    include: sellerBookInclude,
  });
  const sold = await salesByBook(rows.map((r) => r.id));
  return rows.map((r) => toSellerBook(r, sold));
}

// Placeholder until orders exist: 30 days of zeros, oldest first.
function emptySeries(days = 30) {
  const out = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - i));
    out.push({ date: d.toISOString().slice(0, 10), sales: 0, revenue: 0, downloads: 0 });
  }
  return out;
}

async function getOverview(userId) {
  return { books: await listBooks(userId), orders: [], series: emptySeries() };
}

async function loadSellerBook(id) {
  const row = await prisma.book.findUnique({ where: { id }, include: sellerBookInclude });
  const sold = await salesByBook([id]);
  return toSellerBook(row, sold);
}

// Creates a book submitted from the wizard. It starts as "pending" (waiting for
// admin review). The files come from earlier uploads (fileUploadId, coverUploadId).
async function createBook(userId, input) {
  const author = await requireAuthor(userId);

  const category = await prisma.category.findUnique({ where: { name: input.category } });
  if (!category) {
    throw new AppError(
      400,
      'INVALID_CATEGORY',
      'That category is no longer available. Choose another one.'
    );
  }

  // Copies the uploaded files to their permanent places (or throws).
  const claim = await uploads.claimForBook(userId, {
    fileUploadId: input.fileUploadId,
    coverUploadId: input.coverUploadId,
  });

  // Remove duplicate tags (ignoring upper or lower case).
  const tagNames = [...new Map(input.tags.map((t) => [t.toLowerCase(), t])).values()];

  let book;
  try {
    book = await prisma.$transaction(async (tx) => {
      const created = await tx.book.create({
        data: {
          authorId: author.id,
          categoryId: category.id,
          title: input.title,
          subtitle: input.subtitle || null,
          description: input.description,
          coverUrl: claim.coverUrl,
          price: input.price,
          compareAtPrice: input.compareAtPrice ?? null,
          currency: input.currency,
          language: input.language,
          format: claim.file.format,
          status: 'pending',
          rightsBasis: input.rights.basis,
          rightsDetails: input.rights.details || null,
          rightsConfirmedAt: new Date(), // stamped by the server, not the browser
          file: { create: claim.file },
        },
      });

      for (const name of tagNames) {
        const tag = await tx.tag.upsert({ where: { name }, update: {}, create: { name } });
        await tx.bookTag.create({ data: { bookId: created.id, tagId: tag.id } });
      }

      await tx.pendingUpload.deleteMany({ where: { id: { in: claim.pendingIds } } });
      return created;
    });
  } catch (err) {
    await claim.rollback(); // the book was not saved, so remove the copies
    throw err;
  }

  await claim.finish();

  return {
    id: book.id,
    status: book.status,
    submittedAt: book.createdAt.toISOString(),
  };
}

// Edits one of the seller's own books.
//   intent "save"   -> keeps the status (drafts may be incomplete)
//   intent "submit" -> checks everything, then moves the book to "pending"
async function updateBook(userId, bookId, input) {
  const author = await requireAuthor(userId);

  // Only the owner can see the book. Anyone else gets "not found".
  const book = await prisma.book.findFirst({ where: { id: bookId, authorId: author.id } });
  if (!book) throw new AppError(404, 'BOOK_NOT_FOUND', 'Book not found.');

  if (book.status === 'pending') {
    throw new AppError(
      409,
      'BOOK_IN_REVIEW',
      "This book is in review, so it can't be edited right now."
    );
  }

  const submitting = input.intent === 'submit';
  if (submitting && book.status === 'published') {
    throw new AppError(409, 'ALREADY_PUBLISHED', 'This book is already published.');
  }

  // Published books go live on every save, so they need the full check too.
  if (submitting || book.status === 'published') {
    const problem = completenessProblem(input);
    if (problem) throw new AppError(400, 'VALIDATION_ERROR', problem);
  }

  if (submitting && (!book.rightsBasis || !book.rightsConfirmedAt)) {
    throw new AppError(
      400,
      'RIGHTS_REQUIRED',
      'Confirm your publishing rights before submitting this book.'
    );
  }

  let categoryId = null;
  if (input.category) {
    const category = await prisma.category.findUnique({ where: { name: input.category } });
    if (!category) {
      throw new AppError(
        400,
        'INVALID_CATEGORY',
        'That category is no longer available. Choose another one.'
      );
    }
    categoryId = category.id;
  }

  const tagNames = [...new Map(input.tags.map((t) => [t.toLowerCase(), t])).values()];

  const data = {
    title: input.title,
    subtitle: input.subtitle || null,
    description: input.description || null,
    categoryId,
    price: input.price,
    compareAtPrice: input.compareAtPrice ?? null,
    currency: input.currency,
    language: input.language || 'English',
  };
  if (submitting) {
    data.status = 'pending';
    data.rejectionReason = null;
  }

  await prisma.$transaction(async (tx) => {
    await tx.book.update({ where: { id: book.id }, data });
    await tx.bookTag.deleteMany({ where: { bookId: book.id } });
    for (const name of tagNames) {
      const tag = await tx.tag.upsert({ where: { name }, update: {}, create: { name } });
      await tx.bookTag.create({ data: { bookId: book.id, tagId: tag.id } });
    }
  });

  return loadSellerBook(book.id);
}

async function unpublishBook(userId, bookId) {
  const author = await requireAuthor(userId);

  const book = await prisma.book.findFirst({ where: { id: bookId, authorId: author.id } });
  if (!book) throw new AppError(404, 'BOOK_NOT_FOUND', 'Book not found.');
  if (book.status !== 'published') {
    throw new AppError(409, 'NOT_PUBLISHED', 'Only published books can be unpublished.');
  }

  await prisma.book.update({ where: { id: book.id }, data: { status: 'archived' } });
  return loadSellerBook(book.id);
}

module.exports = {
  getProfile,
  saveProfile,
  getOverview,
  createBook,
  updateBook,
  unpublishBook,
  // shared with the admin service
  toSellerBook,
  salesByBook,
  sellerBookInclude,
};