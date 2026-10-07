export type UserRole = "user" | "seller" | "admin" | "super_admin";
export type UserStatus = "active" | "suspended";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  bio?: string;
  favoriteCategories?: string[];
}

export type SessionState =
  | "loading"
  | "guest"
  | "authenticated"
  | "seller"
  | "admin"
  | "suspended";

export interface SellerProfile {
  displayName: string;
  bio: string;
  websiteUrl?: string;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  bio?: string;
  favoriteCategories?: string[];
  sellerProfile?: SellerProfile;
}