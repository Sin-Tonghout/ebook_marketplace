"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authService } from "@/services/auth.service";
// import type { SessionState, SessionUser } from "@/types/auth";
import type { SellerProfile, SessionState, SessionUser } from "@/types/auth";

interface AuthContextValue {
  user: SessionUser | null;
  state: SessionState;
  updateProfile: (
    patch: Partial<Pick<SessionUser, "name" | "bio" | "favoriteCategories">>
  ) => Promise<SessionUser>;
  login: (email: string, password: string) => Promise<SessionUser>;
  register: (name: string, email: string, password: string) => Promise<SessionUser>;
  becomeSeller: (profile: SellerProfile, rightsConfirmed: boolean) => Promise<SessionUser>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function deriveState(user: SessionUser | null, ready: boolean): SessionState {
  if (!ready) return "loading";
  if (!user) return "guest";
  if (user.status === "suspended") return "suspended";
  if (user.role === "admin" || user.role === "super_admin") return "admin";
  if (user.role === "seller") return "seller";
  return "authenticated";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);

  // Read the saved session after mount (avoids SSR hydration mismatch)
  useEffect(() => {
    setUser(authService.getSession());
    setReady(true);
  }, []);

  const updateProfile = useCallback(
    async (patch: Partial<Pick<SessionUser, "name" | "bio" | "favoriteCategories">>) => {
      const u = await authService.updateProfile(patch);
      setUser(u);
      return u;
    },
    []
  );

    const becomeSeller = useCallback(async (profile: SellerProfile, rightsConfirmed: boolean) => {
    const u = await authService.becomeSeller(profile, rightsConfirmed);
    setUser(u);
    return u;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const u = await authService.login(email, password);
    setUser(u);
    return u;
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const u = await authService.register(name, email, password);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, state: deriveState(user, ready), login, register, updateProfile, becomeSeller, logout }),
    [user, ready, login, register, updateProfile, becomeSeller, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}