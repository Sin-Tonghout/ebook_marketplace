const { z } = require('zod');

const str = () => z.string({ error: 'This field is required.' });

function isHttpUrl(value) {
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

// Empty is allowed. Otherwise it must be a full http(s) link.
const optionalUrl = () =>
  str()
    .trim()
    .max(500, 'That link is too long.')
    .refine((v) => !v || isHttpUrl(v), 'Enter a full link, like https://example.com.')
    .default('');

// Same limits as the profile form (NAME_MAX 60, BIO_MAX 500).
const sellerProfileSchema = z.object({
  displayName: str()
    .trim()
    .min(1, 'Add the name readers will see.')
    .max(60, 'Keep your name under 60 characters.'),
  bio: str().trim().max(500, 'Keep your bio under 500 characters.').default(''),
  website: optionalUrl(),
  instagram: optionalUrl(),
  x: optionalUrl(),
});

module.exports = { sellerProfileSchema };