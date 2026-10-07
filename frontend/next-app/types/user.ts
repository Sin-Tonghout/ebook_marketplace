export type UserRole = "reader" | "seller" | "admin";

export interface NavUser {
  name: string;
  email: string;
  avatarUrl?: string | null;
  role: UserRole;
}