import { api } from "@/lib/api";
import type { SellerPublicProfile } from "@/types/seller";

/** Resolves null when the account has no seller profile yet. */
export async function fetchSellerProfile(): Promise<SellerPublicProfile | null> {
  const { profile } = await api<{ profile: SellerPublicProfile | null }>("/seller/profile");
  return profile;
}

/** Returns the profile as the server saved it. Throws with a readable message. */
export async function saveSellerProfile(
  profile: SellerPublicProfile
): Promise<SellerPublicProfile> {
  const data = await api<{ profile: SellerPublicProfile }>("/seller/profile", {
    method: "PUT",
    body: profile,
  });
  return data.profile;
}