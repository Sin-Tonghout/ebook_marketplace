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

// ---------------------------------------------------------------------------
// Publishing rules. These repeat the wizard's own rules, because the server
// must never trust the browser.
// ---------------------------------------------------------------------------

const LANGUAGES = ['English', 'Khmer', 'French', 'Chinese', 'Japanese', 'Other'];

const PRICE_LIMITS = {
  USD: { min: 0.99, max: 999.99 },
  KHR: { min: 4000, max: 4000000 },
};

function priceProblem(value, currency) {
  if (currency === 'KHR' && !Number.isInteger(value)) {
    return 'Riel prices must be whole numbers.';
  }
  if (currency === 'USD' && Math.round(value * 100) / 100 !== value) {
    return 'Use at most 2 decimal places.';
  }
  const { min, max } = PRICE_LIMITS[currency];
  if (value < min) return `The minimum price is ${min.toLocaleString('en-US')} ${currency}.`;
  if (value > max) return `The maximum price is ${max.toLocaleString('en-US')} ${currency}.`;
  return null;
}

// price = what readers pay. compareAtPrice = the crossed-out regular price.
function pricingProblem({ price, compareAtPrice, currency }) {
  if (price > 0) {
    const p = priceProblem(price, currency);
    if (p) return { path: 'price', message: p };
  }
  if (compareAtPrice != null) {
    if (price === 0) {
      return { path: 'compareAtPrice', message: 'A free book cannot have a regular price.' };
    }
    const p = priceProblem(compareAtPrice, currency);
    if (p) return { path: 'compareAtPrice', message: p };
    if (compareAtPrice <= price) {
      return {
        path: 'compareAtPrice',
        message: 'The promotional price must be lower than the regular price.',
      };
    }
  }
  return null;
}

// Used when a book is submitted for review or is already published.
// Returns the first problem as a message, or null when the book is complete.
function completenessProblem(v) {
  if (v.description.length < 50) {
    return 'Write at least 50 characters so readers know what to expect.';
  }
  if (!v.category) return 'Choose a category.';
  if (!LANGUAGES.includes(v.language)) return 'Choose the language of the book.';
  const pp = pricingProblem(v);
  return pp ? pp.message : null;
}

// Creating a book from the wizard (always submitted for review).
const createBookSchema = z
  .object({
    title: str().trim().min(1, 'Give your book a title.').max(120, 'Keep the title under 120 characters.'),
    subtitle: str().trim().max(160, 'Keep the subtitle under 160 characters.').default(''),
    description: str()
      .trim()
      .min(50, 'Write at least 50 characters so readers know what to expect.')
      .max(2000, 'Keep the description under 2000 characters.'),
    category: str().trim().min(1, 'Choose a category.'),
    language: z.enum(LANGUAGES, { error: 'Choose the language of the book.' }),
    tags: z.array(str().trim().min(1).max(30, 'Keep each tag under 30 characters.')).max(8, 'Use at most 8 tags.').default([]),
    fileUploadId: str().trim().min(1, 'Upload your book file to continue.'),
    coverUploadId: str().trim().min(1).nullable().optional(),
    price: z.number({ error: 'Enter a price.' }).min(0, 'Price cannot be negative.'),
    compareAtPrice: z.number().optional(),
    currency: z.enum(['USD', 'KHR'], { error: 'Choose a currency.' }),
    rights: z.object({
      basis: z.enum(['owner', 'licensed', 'public-domain'], {
        error: 'Tell us on what basis you can publish this book.',
      }),
      details: str().trim().max(500, 'Keep this under 500 characters.').default(''),
      confirmed: z.literal(true, {
        error: 'Confirm that you have the legal right to distribute this book.',
      }),
    }),
  })
  .superRefine((v, ctx) => {
    const issue = (path, message) => ctx.addIssue({ code: 'custom', path, message });

    const pp = pricingProblem(v);
    if (pp) issue([pp.path], pp.message);

    if (v.rights.basis !== 'owner' && v.rights.details.length < 10) {
      issue(
        ['rights', 'details'],
        v.rights.basis === 'licensed'
          ? 'Describe who gave you permission and what it covers.'
          : "Say where this book's public-domain status comes from."
      );
    }
  });

// Editing a book. Saving a draft is lenient (only a title is required). The
// complete rules are checked in the service when submitting or when published.
const updateBookSchema = z.object({
  intent: z.enum(['save', 'submit'], { error: 'Unknown action.' }),
  title: str().trim().min(1, 'Give your book a title.').max(120, 'Keep the title under 120 characters.'),
  subtitle: str().trim().max(160, 'Keep the subtitle under 160 characters.').default(''),
  description: str().trim().max(2000, 'Keep the description under 2000 characters.').default(''),
  category: str().trim().max(100).default(''),
  language: str().trim().max(50).default(''),
  tags: z.array(str().trim().min(1).max(30, 'Keep each tag under 30 characters.')).max(8, 'Use at most 8 tags.').default([]),
  price: z.number({ error: 'Enter a price.' }).min(0, 'Price cannot be negative.').max(100000000),
  compareAtPrice: z.number().max(100000000).nullable().optional(),
  currency: z.enum(['USD', 'KHR'], { error: 'Choose a currency.' }),
});

module.exports = {
  sellerProfileSchema,
  createBookSchema,
  updateBookSchema,
  completenessProblem,
};