import type { SessionUser } from "@/types/auth";
import type { SellerPublicProfile } from "@/types/seller";

export const NAME_MAX = 60;
export const BIO_MAX = 500;

export type ProfileErrors = Partial<Record<keyof SellerPublicProfile, string>>;

/** Starting values: what the account already knows about the seller. */
export function defaultProfile(user: SessionUser | null): SellerPublicProfile {
  return {
    displayName: user?.sellerProfile?.displayName ?? user?.name ?? "",
    bio: user?.sellerProfile?.bio ?? user?.bio ?? "",
    website: user?.sellerProfile?.websiteUrl ?? "",
    instagram: "",
    x: "",
  };
}

export function isValidUrl(raw: string): boolean {
  try {
    const u = new URL(raw.trim());
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

const URL_ERROR = "Enter a full link, like https://example.com.";

export function validateProfile(p: SellerPublicProfile): ProfileErrors {
  const e: ProfileErrors = {};

  if (!p.displayName.trim()) e.displayName = "Add the name readers will see.";
  else if (p.displayName.trim().length > NAME_MAX)
    e.displayName = `Keep your name under ${NAME_MAX} characters.`;

  if (p.bio.length > BIO_MAX)
    e.bio = `Keep your bio under ${BIO_MAX} characters.`;

  for (const key of ["website", "instagram", "x"] as const) {
    const value = p[key].trim();
    if (value && !isValidUrl(value)) e[key] = URL_ERROR;
  }
  return e;
}

export function cleanProfile(p: SellerPublicProfile): SellerPublicProfile {
  return {
    displayName: p.displayName.trim(),
    bio: p.bio.trim(),
    website: p.website.trim(),
    instagram: p.instagram.trim(),
    x: p.x.trim(),
  };
}