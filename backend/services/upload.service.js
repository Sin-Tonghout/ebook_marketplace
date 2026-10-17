const fsp = require('fs').promises;
const path = require('path');
const prisma = require('../config/db');
const { AppError } = require('../utils/response');
const storage = require('./storage.service');

const MAX_PENDING = 20; // unfinished uploads per user
const TTL_MS = 24 * 60 * 60 * 1000; // pending uploads expire after 24 hours

const MIME = {
  pdf: 'application/pdf',
  epub: 'application/epub+zip',
  jpg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
};

async function readHead(filePath, bytes = 1024) {
  const handle = await fsp.open(filePath, 'r');
  try {
    const buf = Buffer.alloc(bytes);
    const { bytesRead } = await handle.read(buf, 0, bytes, 0);
    return buf.subarray(0, bytesRead);
  } finally {
    await handle.close();
  }
}

// What the file REALLY is, judged by its first bytes, not by its name.
function sniffBook(head) {
  if (head.toString('latin1').includes('%PDF-')) return 'pdf';
  const isZip = head.length > 4 && head[0] === 0x50 && head[1] === 0x4b && head[2] === 0x03 && head[3] === 0x04;
  if (isZip && head.toString('latin1', 0, 120).includes('application/epub+zip')) return 'epub';
  return null;
}

function sniffImage(head) {
  if (head.length >= 3 && head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff) return 'jpg';
  if (head.length >= 8 && head.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'png';
  if (head.length >= 12 && head.toString('latin1', 0, 4) === 'RIFF' && head.toString('latin1', 8, 12) === 'WEBP') return 'webp';
  return null;
}

// The name is only shown to people. It is never used to build a file path.
const safeName = (name) =>
  path.basename(name || 'file')
    .replace(/[\u0000-\u001f\\/:*?"<>|]+/g, '_')
    .slice(0, 255);

// Called after multer has saved the file into storage/tmp.
async function registerUpload(userId, kind, file) {
  if (!file) throw new AppError(400, 'NO_FILE', 'Choose a file to upload.');

  try {
    if (file.size === 0) throw new AppError(400, 'INVALID_FILE', 'That file is empty.');

    const isBook = kind === 'book';
    const ext = path.extname(file.originalname).slice(1).toLowerCase();
    const allowed = isBook ? ['pdf', 'epub'] : ['jpg', 'jpeg', 'png', 'webp'];
    if (!allowed.includes(ext)) {
      throw new AppError(
        400,
        'INVALID_FILE',
        isBook
          ? "That file type isn't supported. Upload a PDF or EPUB."
          : 'Use a JPG, PNG or WebP image.'
      );
    }

    const head = await readHead(file.path);
    const format = isBook ? sniffBook(head) : sniffImage(head);
    const claimed = ext === 'jpeg' ? 'jpg' : ext;
    if (!format || format !== claimed) {
      throw new AppError(
        400,
        'INVALID_FILE',
        isBook
          ? `This file doesn't look like a real ${ext.toUpperCase()}. Check the file and try again.`
          : "This file doesn't look like a JPG, PNG or WebP image."
      );
    }

    const open = await prisma.pendingUpload.count({
      where: { userId, expiresAt: { gt: new Date() } },
    });
    if (open >= MAX_PENDING) {
      throw new AppError(
        429,
        'TOO_MANY_UPLOADS',
        'You have too many unfinished uploads. Submit a book or remove some files first.'
      );
    }

    const row = await prisma.pendingUpload.create({
      data: {
        userId,
        kind,
        storageKey: file.filename,
        originalName: safeName(file.originalname),
        mimeType: MIME[format],
        sizeBytes: file.size,
        format,
        expiresAt: new Date(Date.now() + TTL_MS),
      },
    });

    return { id: row.id, kind, name: row.originalName, size: row.sizeBytes, format };
  } catch (err) {
    await storage.remove('tmp', file.filename); // never keep a rejected file
    throw err;
  }
}

// Removes one of the user's own pending uploads. Safe to call twice.
async function removeUpload(userId, id) {
  const row = await prisma.pendingUpload.findFirst({ where: { id, userId } });
  if (!row) return;
  await storage.remove('tmp', row.storageKey);
  await prisma.pendingUpload.deleteMany({ where: { id: row.id } });
}

async function takePending(userId, id, kind) {
  const row = await prisma.pendingUpload.findFirst({
    where: { id, userId, kind, expiresAt: { gt: new Date() } },
  });
  if (!row) {
    throw new AppError(
      400,
      'UPLOAD_NOT_FOUND',
      kind === 'book'
        ? 'Your book file was not found. Please upload it again.'
        : 'Your cover was not found. Please add it again.'
    );
  }
  return row;
}

// Copies the pending files to their permanent places. The caller then saves
// the book in the database and calls finish(). If saving fails, rollback()
// removes the copies and the pending uploads stay usable for a retry.
async function claimForBook(userId, { fileUploadId, coverUploadId }) {
  const file = await takePending(userId, fileUploadId, 'book');
  const cover = coverUploadId ? await takePending(userId, coverUploadId, 'cover') : null;

  const made = [];
  const rollback = async () => {
    for (const m of made) await storage.remove(m.kind, m.key);
  };

  try {
    const fileKey = await storage.commitBook(file.storageKey, file.format);
    made.push({ kind: 'books', key: fileKey });

    let coverUrl = null;
    if (cover) {
      const coverKey = await storage.commitCover(cover.storageKey, cover.format);
      made.push({ kind: 'covers', key: coverKey });
      coverUrl = storage.coverUrl(coverKey);
    }

    const pending = [file, cover].filter(Boolean);
    return {
      file: {
        storageKey: fileKey,
        originalName: file.originalName,
        mimeType: file.mimeType,
        sizeBytes: file.sizeBytes,
        format: file.format.toUpperCase(), // PDF | EPUB
      },
      coverUrl,
      pendingIds: pending.map((p) => p.id),
      rollback,
      // Remove the temporary originals once the book is saved.
      finish: async () => {
        for (const p of pending) await storage.remove('tmp', p.storageKey);
      },
    };
  } catch (err) {
    await rollback();
    throw err;
  }
}

// Deletes expired pending uploads (files and rows). Runs at startup and hourly.
async function cleanupExpiredUploads() {
  const rows = await prisma.pendingUpload.findMany({
    where: { expiresAt: { lt: new Date() } },
    take: 500,
  });
  for (const row of rows) await storage.remove('tmp', row.storageKey);
  if (rows.length) {
    await prisma.pendingUpload.deleteMany({ where: { id: { in: rows.map((r) => r.id) } } });
  }
  return rows.length;
}

module.exports = { registerUpload, removeUpload, claimForBook, cleanupExpiredUploads };