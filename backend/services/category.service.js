const prisma = require('../config/db');
const { AppError } = require('../utils/response');
const { slugify } = require('../utils/slug');
const audit = require('./audit.service');

// Public list: count published books only (what readers can see).
const publishedCount = {
  _count: { select: { books: { where: { status: 'published' } } } },
};
// Admin list: count every book, because any book blocks deleting a category.
const allCount = { _count: { select: { books: true } } };

const toDto = (c) => ({
  id: c.id,
  name: c.name,
  slug: c.slug,
  sortOrder: c.sortOrder,
  bookCount: c._count?.books ?? 0,
});

const exists409 = () =>
  new AppError(409, 'CATEGORY_EXISTS', 'A category with this name already exists.');

async function uniqueSlug(name, ignoreId) {
  const base = slugify(name) || 'category';
  let slug = base;
  let n = 2;
  for (;;) {
    const hit = await prisma.category.findUnique({ where: { slug } });
    if (!hit || hit.id === ignoreId) return slug;
    slug = `${base}-${n++}`;
  }
}

async function list({ includeUnpublished = false } = {}) {
  const rows = await prisma.category.findMany({
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    include: includeUnpublished ? allCount : publishedCount,
  });
  return rows.map(toDto);
}

async function create(name, actor) {
  const dup = await prisma.category.findUnique({ where: { name } });
  if (dup) throw exists409();

  const last = await prisma.category.aggregate({ _max: { sortOrder: true } });
  let created;
  try {
    created = await prisma.category.create({
      data: {
        name,
        slug: await uniqueSlug(name),
        sortOrder: (last._max.sortOrder ?? -1) + 1,
      },
      include: allCount,
    });
  } catch (err) {
    if (err.code === 'P2002') throw exists409();
    throw err;
  }

  await audit.record(actor, {
    action: 'category.create',
    targetType: 'category',
    targetId: created.id,
    targetLabel: created.name,
  });
  return toDto(created);
}

async function rename(id, name, actor) {
  const current = await prisma.category.findUnique({
    where: { id },
    include: allCount,
  });
  if (!current) throw new AppError(404, 'NOT_FOUND', 'Category not found.');
  if (current.name === name) return toDto(current); // nothing to change

  const dup = await prisma.category.findUnique({ where: { name } });
  if (dup && dup.id !== id) throw exists409();

  let updated;
  try {
    // The slug stays the same so existing links don't break.
    updated = await prisma.category.update({
      where: { id },
      data: { name },
      include: allCount,
    });
  } catch (err) {
    if (err.code === 'P2002') throw exists409();
    throw err;
  }

  await audit.record(actor, {
    action: 'category.rename',
    targetType: 'category',
    targetId: id,
    targetLabel: updated.name,
    detail: `${current.name} → ${updated.name}`,
  });
  return toDto(updated);
}

async function remove(id, actor) {
  const current = await prisma.category.findUnique({ where: { id } });
  if (!current) throw new AppError(404, 'NOT_FOUND', 'Category not found.');

  const total = await prisma.category.count();
  if (total <= 1) {
    throw new AppError(409, 'LAST_CATEGORY', 'Keep at least one category.');
  }

  const inUse = await prisma.book.count({ where: { categoryId: id } });
  if (inUse > 0) {
    throw new AppError(
      409,
      'CATEGORY_IN_USE',
      `${inUse} book${inUse === 1 ? '' : 's'} still use this category.`
    );
  }

  await prisma.category.delete({ where: { id } });
  await audit.record(actor, {
    action: 'category.delete',
    targetType: 'category',
    targetId: id,
    targetLabel: current.name,
  });
}

// ids = every category id in the new order.
async function reorder(ids, actor) {
  const all = await prisma.category.findMany({ select: { id: true } });
  const valid =
    ids.length === all.length &&
    new Set(ids).size === ids.length &&
    all.every((c) => ids.includes(c.id));
  if (!valid) {
    throw new AppError(400, 'INVALID_ORDER', 'The category list changed. Reload and try again.');
  }

  await prisma.$transaction(
    ids.map((id, index) =>
      prisma.category.update({ where: { id }, data: { sortOrder: index } })
    )
  );

  await audit.record(actor, {
    action: 'category.reorder',
    targetType: 'category',
    targetId: 'all',
    targetLabel: 'Category order',
  });
  return list({ includeUnpublished: true });
}

module.exports = { list, create, rename, remove, reorder };