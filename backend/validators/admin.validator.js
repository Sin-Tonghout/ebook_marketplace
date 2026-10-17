const { z } = require('zod');

const str = () => z.string({ error: 'This field is required.' });

const moderateBookSchema = z.object({
  action: z.enum(['approve', 'reject', 'request_changes', 'unpublish'], {
    error: 'Unknown action.',
  }),
  reason: str().trim().max(500, 'Keep the reason under 500 characters.').default(''),
});

module.exports = { moderateBookSchema };