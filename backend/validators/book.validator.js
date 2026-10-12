const { z } = require('zod');

const SORTS = ['newest', 'popular', 'rating', 'price-asc', 'price-desc'];

// Bad or missing values fall back to defaults instead of failing the request.
const listQuerySchema = z.object({
  q: z.string().trim().max(100).optional().catch(undefined),
  category: z.string().trim().toLowerCase().max(120).optional().catch(undefined), // slug
  sort: z.enum(SORTS).catch('newest'),
  page: z.coerce.number().int().min(1).catch(1),
  pageSize: z.coerce.number().int().min(1).max(48).catch(12),
});

module.exports = { listQuerySchema };