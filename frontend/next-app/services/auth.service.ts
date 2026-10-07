// import type { SessionUser } from "@/types/auth";
import type { SellerProfile, SessionUser } from "@/types/auth";
const STORAGE_KEY = "ebook:session";
const USERS_KEY = "ebook:users";

// Demo accounts. Remove in Phase 13 when the Express API takes over.
const DEMO_USERS: (SessionUser & { password: string })[] = [
  { id: "u1", name: "Reader Demo", email: "reader@demo.com", password: "password123", role: "user", status: "active" },
  { id: "u2", name: "Seller Demo", email: "seller@demo.com", password: "password123", role: "seller", status: "active" },
  { id: "u3", name: "Admin Demo", email: "admin@demo.com", password: "password123", role: "admin", status: "active" },
  { id: "u4", name: "Suspended Demo", email: "suspended@demo.com", password: "password123", role: "user", status: "suspended" },
];

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class AuthError extends Error {
  constructor(public code: string, message: string) {
    super(message);
  }
}
function getStoredUsers(): (SessionUser & { password: string })[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function allUsers() {
  return [...DEMO_USERS, ...getStoredUsers()];
}

export const authService = {
  getSession(): SessionUser | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as SessionUser) : null;
    } catch {
      return null;
    }
  },

  async login(email: string, password: string): Promise<SessionUser> {
    await delay(700); // simulate network so loading states are visible
    const found = allUsers().find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (!found || found.password !== password) {
      throw new AuthError("INVALID_CREDENTIALS", "Email or password is incorrect.");
    }
    const { password: _pw, ...user } = found;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return user;
  },

    async register(name: string, email: string, password: string): Promise<SessionUser> {
    await delay(800);
    const exists = allUsers().some(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (exists) {
      throw new AuthError("EMAIL_TAKEN", "An account with this email already exists.");
    }
    const newUser = {
      id: `u${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role: "user" as const,
      status: "active" as const,
    };
    window.localStorage.setItem(USERS_KEY, JSON.stringify([...getStoredUsers(), newUser]));
    const { password: _pw, ...user } = newUser;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return user;
  },

    // Always succeeds, even for unknown emails, so attackers can't probe which emails exist.
  async requestPasswordReset(email: string): Promise<void> {
    await delay(800);
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      throw new AuthError("INVALID_EMAIL", "Enter a valid email address.");
    }
    // Phase 13: the Express API sends the real email here.
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await delay(800);
    if (!token || token === "expired") {
      throw new AuthError("TOKEN_EXPIRED", "This reset link has expired.");
    }
    if (newPassword.length < 8) {
      throw new AuthError("WEAK_PASSWORD", "Use at least 8 characters.");
    }
    // Phase 13: the API validates the token and updates the password hash.
  },

    async updateProfile(
    patch: Partial<Pick<SessionUser, "name" | "bio" | "favoriteCategories">>
  ): Promise<SessionUser> {
    await delay(600);
    const current = authService.getSession();
    if (!current) throw new AuthError("UNAUTHENTICATED", "Please sign in again.");
    if (patch.name !== undefined && !patch.name.trim()) {
      throw new AuthError("INVALID_NAME", "Name can't be empty.");
    }

    const updated: SessionUser = { ...current, ...patch, name: (patch.name ?? current.name).trim() };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    const stored = getStoredUsers().map((u) =>
      u.id === updated.id ? { ...u, ...patch, name: updated.name } : u
    );
    window.localStorage.setItem(USERS_KEY, JSON.stringify(stored));
    return updated;
  },

    async becomeSeller(profile: SellerProfile, rightsConfirmed: boolean): Promise<SessionUser> {
    await delay(900);
    const current = authService.getSession();
    if (!current) throw new AuthError("UNAUTHENTICATED", "Please sign in again.");
    if (current.status === "suspended") {
      throw new AuthError("SUSPENDED", "Suspended accounts can't become sellers.");
    }
    if (!rightsConfirmed) {
      throw new AuthError("RIGHTS_REQUIRED", "You need to confirm your publishing rights.");
    }
    if (!profile.displayName.trim()) {
      throw new AuthError("INVALID_NAME", "Add a display name.");
    }

    const role = current.role === "user" ? "seller" : current.role; // never downgrade admins
    const updated: SessionUser = { ...current, role, sellerProfile: profile };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    const stored = getStoredUsers().map((u) =>
      u.id === updated.id ? { ...u, role, sellerProfile: profile } : u
    );
    window.localStorage.setItem(USERS_KEY, JSON.stringify(stored));
    return updated;
  },

  async logout(): Promise<void> {
    await delay(150);
    window.localStorage.removeItem(STORAGE_KEY);
  },
};