const prisma = require('../config/db');
const { AppError } = require('../utils/response');
const audit = require('./audit.service');
const { toSellerBook, salesByBook, sellerBookInclude } = require('./seller.service');

// Which status each action is allowed to start from, and where it ends up.
const ALLOWED_FROM = {
  approve: 'pending',
  reject: 'pending',
  request_changes: 'pending',
  unpublish: 'published',
};
const NEXT_STATUS = {
  approve: 'published',
  reject: 'rejected',
  request_changes: 'rejected',
  unpublish: 'archived',
};

// What the seller is told (stored as a notification).
const NOTICE = {
  approve: {
    title: 'Your book was approved',
    body: (t) => `"${t}" is now live in the store.`,
  },
  reject: {
    title: "Your book wasn't approved",
    body: (t, n) => `"${t}": ${n}`,
  },
  request_changes: {
    title: 'Changes requested',
    body: (t, n) => `"${t}": ${n}`,
  },
  unpublish: {
    title: 'Your book was unpublished',
    body: (t, n) => (n ? `"${t}": ${n}` : `"${t}" was removed from the store.`),
  },
};

const alreadyChanged = () =>
  new AppError(409, 'ALREADY_CHANGED', 'This book was already changed. Reload the queue.');

// Every book except private drafts, newest activity first.
async function listBooks() {
  const rows = await prisma.book.findMany({
    where: { status: { not: 'draft' } },
    orderBy: { updatedAt: 'desc' },
    take: 200,
    include: sellerBookInclude,
  });
  const sold = await salesByBook(rows.map((r) => r.id));
  return rows.map((r) => toSellerBook(r, sold));
}

// actor = the signed-in admin (Prisma user with id and name).
async function moderateBook(actor, bookId, action, reason) {
  const note = reason.trim();
  if ((action === 'reject' || action === 'request_changes') && note.length < 10) {
    throw new AppError(400, 'REASON_REQUIRED', 'Please write a reason of at least 10 characters.');
  }

  const book = await prisma.book.findUnique({
    where: { id: bookId },
    include: { author: { select: { userId: true } } },
  });
  if (!book) throw new AppError(404, 'BOOK_NOT_FOUND', 'Book not found.');
  if (book.status !== ALLOWED_FROM[action]) throw alreadyChanged();

  const data = {
    status: NEXT_STATUS[action],
    rejectionReason:
      action === 'reject'
        ? note
        : action === 'request_changes'
          ? `Changes requested: ${note}`
          : null,
  };
  if (action === 'approve' && !book.publishedAt) data.publishedAt = new Date();

  await prisma.$transaction(async (tx) => {
    // Only change the book if it still has the status we checked. This stops
    // two admins from deciding on the same book at the same moment.
    const changed = await tx.book.updateMany({
      where: { id: book.id, status: book.status },
      data,
    });
    if (changed.count === 0) throw alreadyChanged();

    await tx.notification.create({
      data: {
        userId: book.author.userId,
        type: `book.${action}`,
        title: NOTICE[action].title,
        body: NOTICE[action].body(book.title, note),
      },
    });

    await audit.record(
      actor,
      {
        action: `book.${action}`,
        targetType: 'book',
        targetId: book.id,
        targetLabel: book.title,
        detail: note || undefined,
      },
      tx
    );
  });

  const row = await prisma.book.findUnique({
    where: { id: book.id },
    include: sellerBookInclude,
  });
  const sold = await salesByBook([book.id]);
  return toSellerBook(row, sold);
}

async function getStats() {
  const [users, books, pendingReviews, orders, revenue, openReports] = await Promise.all([
    prisma.user.count(),
    prisma.book.count({ where: { status: 'published' } }),
    prisma.book.count({ where: { status: 'pending' } }),
    prisma.order.count({ where: { status: 'completed' } }),
    prisma.payment.aggregate({
      where: { status: 'paid', currency: 'USD' },
      _sum: { amount: true },
    }),
    prisma.report.count({ where: { status: 'open' } }),
  ]);

  return {
    users,
    books,
    pendingReviews,
    orders,
    revenue: Number(revenue._sum.amount ?? 0),
    openReports,
  };
}

module.exports = { listBooks, moderateBook, getStats };