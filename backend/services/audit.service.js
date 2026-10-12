const prisma = require('../config/db');

// actor = the signed-in Prisma user (needs id and name).
async function record(actor, entry, db = prisma) {
  await db.auditLog.create({
    data: {
      actorId: actor.id,
      actorName: actor.name,
      action: entry.action, // e.g. "category.create"
      targetType: entry.targetType, // book | user | category | report
      targetId: entry.targetId,
      targetLabel: entry.targetLabel,
      detail: entry.detail || null,
    },
  });
}

module.exports = { record };