const { z } = require('zod');

const str = () => z.string({ error: 'This field is required.' });

// Same rules as the admin form: 2 to 30 characters, extra spaces collapsed.
const categoryNameSchema = z.object({
  name: str()
    .transform((s) => s.trim().replace(/\s+/g, ' '))
    .pipe(
      z
        .string()
        .min(2, 'Use at least 2 characters.')
        .max(30, 'Keep it under 30 characters.')
    ),
});

const reorderSchema = z.object({
  ids: z.array(str()).min(1, 'Nothing to reorder.'),
});

module.exports = { categoryNameSchema, reorderSchema };