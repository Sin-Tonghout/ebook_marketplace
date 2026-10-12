const { z } = require('zod');

const str = () => z.string({ error: 'This field is required.' });

const email = str()
  .trim()
  .toLowerCase()
  .pipe(z.email('Enter a valid email address.'));

const newPassword = str()
  .min(8, 'Use at least 8 characters.')
  .max(128, 'Password is too long.');

const registerSchema = z.object({
  name: str().trim().min(1, "Name can't be empty.").max(120),
  email,
  password: newPassword,
});

const loginSchema = z.object({
  email,
  password: str().min(1, 'Enter your password.'),
});

const forgotPasswordSchema = z.object({ email });

const resetPasswordSchema = z.object({
  token: str().min(1, 'This reset link has expired.'),
  password: newPassword,
});

const updateProfileSchema = z.object({
  name: str().trim().min(1, "Name can't be empty.").max(120).optional(),
  bio: str().max(1000, 'Bio is too long.').optional(),
  favoriteCategories: z.array(str().max(100)).max(20).optional(),
});

const becomeSellerSchema = z.object({
  profile: z.object({
    displayName: str().trim().min(1, 'Add a display name.').max(120),
    bio: str().max(1000, 'Bio is too long.').default(''),
    websiteUrl: str()
      .trim()
      .max(500)
      .refine((v) => !v || /^https?:\/\//i.test(v), 'Website must start with http:// or https://')
      .optional(),
  }),
  rightsConfirmed: z.boolean({ error: 'You need to confirm your publishing rights.' }),
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
  becomeSellerSchema,
};