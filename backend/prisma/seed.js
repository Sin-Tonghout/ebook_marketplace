const crypto = require('crypto');
const env = require('../config/env'); // loads .env
const bcrypt = require('bcryptjs');
const prisma = require('../config/db');
const { slugify } = require('../utils/slug');
const data = require('./seed-data');
const { SELLER_BOOKS, daysAgo } = require('./seed-seller-books');

if (env.isProd) {
  console.error('Refusing to seed demo data in production.');
  process.exit(1);
}

const DEMO = [
  { name: 'Reader Demo', email: 'reader@demo.com', role: 'user', status: 'active' },
  { name: 'Seller Demo', email: 'seller@demo.com', role: 'seller', status: 'active' },
  { name: 'Admin Demo', email: 'admin@demo.com', role: 'admin', status: 'active' },
  { name: 'Suspended Demo', email: 'suspended@demo.com', role: 'user', status: 'suspended' },
];

// Same names and order as the frontend mock list.
const CATEGORIES = [
  'Technology',
  'Design',
  'Business',
  'Fiction',
  'Non-fiction',
  'Science',
  'History',
  'Self-improvement',
  'Children',
  'Poetry',
];

async function seedUsers() {
  const passwordHash = await bcrypt.hash('password123', 12);

  for (const u of DEMO) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name, role: u.role, status: u.status, passwordHash },
      create: { ...u, passwordHash },
    });

    if (u.role === 'seller') {
      await prisma.author.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
          displayName: 'Seller Demo',
          bio: 'Demo seller account.',
          rightsConfirmedAt: new Date(),
        },
      });
    }
  }
  console.log('Seeded demo accounts (password: password123).');
}

// Running the seed again resets these 10 categories to this order.
async function seedCategories() {
  for (const [index, name] of CATEGORIES.entries()) {
    await prisma.category.upsert({
      where: { slug: slugify(name) },
      update: { sortOrder: index },
      create: { name, slug: slugify(name), sortOrder: index },
    });
  }
  console.log(`Seeded ${CATEGORIES.length} categories.`);
}

async function seedCatalog() {
  // Nobody can sign in with this hash. These accounts only own demo books.
  const unusableHash = await bcrypt.hash(crypto.randomUUID(), 12);

  // Authors (each needs a user account)
  for (const a of data.AUTHORS) {
    const user = await prisma.user.upsert({
      where: { email: `${a.id}@authors.demo` },
      update: { name: a.name, role: 'seller', status: 'active' },
      create: {
        name: a.name,
        email: `${a.id}@authors.demo`,
        passwordHash: unusableHash,
        role: 'seller',
        status: 'active',
      },
    });
    await prisma.author.upsert({
      where: { id: a.id },
      update: { displayName: a.name, bio: a.bio },
      create: {
        id: a.id,
        userId: user.id,
        displayName: a.name,
        bio: a.bio,
        rightsConfirmedAt: new Date(),
      },
    });
  }

  // Books and their preview pages
  for (const b of data.BOOKS) {
    const category = await prisma.category.findUnique({ where: { name: b.category } });
    if (!category) throw new Error(`Category "${b.category}" is missing. Run the category seed first.`);

    const fields = {
      authorId: b.authorId,
      categoryId: category.id,
      title: b.title,
      subtitle: b.subtitle ?? null,
      description: b.description ?? null,
      price: b.price,
      compareAtPrice: b.compareAtPrice ?? null,
      currency: 'USD',
      language: 'English',
      format: b.format,
      pages: b.pages,
      status: 'published',
      ratingAvg: b.rating,
      ratingCount: b.ratingCount,
      publishedAt: new Date(b.publishedAt),
    };
    await prisma.book.upsert({
      where: { id: b.id },
      update: fields,
      create: { id: b.id, ...fields },
    });

    const pages = data.PREVIEWS[b.id] ?? data.GENERIC_PREVIEW;
    await prisma.bookPreview.deleteMany({ where: { bookId: b.id } });
    await prisma.bookPreview.createMany({
      data: pages.map((p, position) => ({
        bookId: b.id,
        position,
        title: p.chapter ?? null,
        content: p.text,
      })),
    });
  }

  // Reviews
  for (const r of data.REVIEWS) {
    const user = await prisma.user.upsert({
      where: { email: r.email },
      update: { name: r.name },
      create: { name: r.name, email: r.email, passwordHash: unusableHash, role: 'user', status: 'active' },
    });
    const fields = {
      rating: r.rating,
      title: r.title,
      body: r.body,
      createdAt: new Date(r.createdAt),
    };
    await prisma.review.upsert({
      where: { userId_bookId: { userId: user.id, bookId: r.bookId } },
      update: fields,
      create: { userId: user.id, bookId: r.bookId, ...fields },
    });
  }

  console.log(`Seeded ${data.AUTHORS.length} authors and ${data.BOOKS.length} books.`);
}

// The seller demo's own books, in every status (draft, pending, rejected...).
async function seedSellerBooks() {
  const seller = await prisma.user.findUnique({
    where: { email: 'seller@demo.com' },
    include: { author: true },
  });
  if (!seller?.author) throw new Error('The seller demo has no author profile.');

  for (const b of SELLER_BOOKS) {
    let categoryId = null;
    if (b.category) {
      const category = await prisma.category.findUnique({ where: { name: b.category } });
      if (!category) throw new Error(`Category "${b.category}" is missing.`);
      categoryId = category.id;
    }

    const fields = {
      authorId: seller.author.id,
      categoryId,
      title: b.title,
      subtitle: b.subtitle ?? null,
      description: b.description || null,
      price: b.price,
      compareAtPrice: b.compareAtPrice ?? null,
      currency: 'USD',
      language: b.language,
      format: b.format ?? null,
      status: b.status,
      rejectionReason: b.rejectionReason ?? null,
      rightsBasis: 'owner',
      rightsConfirmedAt: new Date(),
      views: b.views,
      downloads: b.downloads,
      ratingAvg: b.rating,
      ratingCount: b.reviewCount,
      publishedAt: b.publishedAt ? new Date(b.publishedAt) : null,
      updatedAt: daysAgo(b.updatedDaysAgo),
    };
    await prisma.book.upsert({
      where: { id: b.id },
      update: fields,
      create: { id: b.id, ...fields },
    });

    await prisma.bookTag.deleteMany({ where: { bookId: b.id } });
    for (const name of b.tags) {
      const tag = await prisma.tag.upsert({ where: { name }, update: {}, create: { name } });
      await prisma.bookTag.create({ data: { bookId: b.id, tagId: tag.id } });
    }
  }
  console.log(`Seeded ${SELLER_BOOKS.length} seller books.`);
}

async function main() {
  await seedUsers();
  await seedCategories();
  await seedCatalog();
  await seedSellerBooks();
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());