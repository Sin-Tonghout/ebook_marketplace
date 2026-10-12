import { api, ApiError } from "@/lib/api";
import type { SellerProfile, SessionUser } from "@/types/auth";

export class AuthError extends Error {
  constructor(public code: string, message: string) {
    super(message);
  }
}

// Turns API errors into AuthError so existing forms keep working unchanged.
async function call<T>(
  path: string,
  options?: { method?: "GET" | "POST" | "PATCH"; body?: unknown }
): Promise<T> {
  try {
    return await api<T>(path, options);
  } catch (err) {
    if (err instanceof ApiError) throw new AuthError(err.code, err.message);
    throw err;
  }
}

type UserOverride = Partial<Pick<SessionUser, "role" | "status">>;

export const authService = {
  /** Asks the API who is signed in. Resolves null for guests. */
  async getSession(): Promise<SessionUser | null> {
    const { user } = await call<{ user: SessionUser | null }>("/auth/me");
    return user;
  },

  async login(email: string, password: string): Promise<SessionUser> {
    const { user } = await call<{ user: SessionUser }>("/auth/login", {
      method: "POST",
      body: { email, password },
    });
    return user;
  },

  async register(name: string, email: string, password: string): Promise<SessionUser> {
    const { user } = await call<{ user: SessionUser }>("/auth/register", {
      method: "POST",
      body: { name, email, password },
    });
    return user;
  },

  // The API always succeeds for valid emails, even unknown ones.
  async requestPasswordReset(email: string): Promise<void> {
    await call("/auth/forgot-password", { method: "POST", body: { email } });
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await call("/auth/reset-password", {
      method: "POST",
      body: { token, password: newPassword },
    });
  },

  async updateProfile(
    patch: Partial<Pick<SessionUser, "name" | "bio" | "favoriteCategories">>
  ): Promise<SessionUser> {
    const { user } = await call<{ user: SessionUser }>("/auth/profile", {
      method: "PATCH",
      body: patch,
    });
    return user;
  },

  async becomeSeller(profile: SellerProfile, rightsConfirmed: boolean): Promise<SessionUser> {
    const { user } = await call<{ user: SessionUser }>("/auth/become-seller", {
      method: "POST",
      body: { profile, rightsConfirmed },
    });
    return user;
  },

  async logout(): Promise<void> {
    await call("/auth/logout", { method: "POST" });
  },

  // -------------------------------------------------------------------------
  // TEMPORARY admin mock (Phase 12). Not connected to the database.
  // The Admin API step replaces listUsers / updateUserAccess with real
  // endpoints. Until then the admin Users page keeps working against this list.
  // -------------------------------------------------------------------------

  listUsers(): (SessionUser & { source: "demo" | "registered" })[] {
    return MOCK_USERS.map((u) => ({ ...applyOverride(u), source: "demo" as const }));
  },

  async updateUserAccess(id: string, patch: UserOverride): Promise<void> {
    if (!MOCK_USERS.some((u) => u.id === id)) {
      throw new AuthError("NOT_FOUND", "User not found.");
    }
    const overrides = readOverrides();
    overrides[id] = { ...overrides[id], ...patch };
    window.localStorage.setItem(OVERRIDES_KEY, JSON.stringify(overrides));
  },
};

// ---- temporary mock data for the admin Users page ----

const OVERRIDES_KEY = "ebook:user-overrides";

const MOCK_USERS: SessionUser[] = [
  { id: "u1", name: "Reader Demo", email: "reader@demo.com", role: "user", status: "active" },
  { id: "u2", name: "Seller Demo", email: "seller@demo.com", role: "seller", status: "active" },
  { id: "u3", name: "Admin Demo", email: "admin@demo.com", role: "admin", status: "active" },
  { id: "u4", name: "Suspended Demo", email: "suspended@demo.com", role: "user", status: "suspended" },
];

function readOverrides(): Record<string, UserOverride> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(OVERRIDES_KEY) || "{}");
  } catch {
    return {};
  }
}

function applyOverride<T extends SessionUser>(u: T): T {
  const o = readOverrides()[u.id];
  return o ? { ...u, ...o } : u;
}