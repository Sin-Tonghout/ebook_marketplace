"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";
import { Navbar } from "@/components/layout/Navbar";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { useToast } from "@/components/ui/Toast";
import type { NavUser } from "@/types/user";

export function SiteHeader() {
  const { toast } = useToast();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);

  // Map the session user to what the Navbar expects
    const navUser: NavUser | null = user
    ? {
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl ?? null,
        role: user.role as NavUser["role"],
      }
    : null;
    
  const handleLogout = async () => {
    await logout();
    toast({ title: "Logged out" });
    router.push("/");
  };

  return (
    <>
      <Navbar
        user={navUser}
        onSearchOpen={() => setSearchOpen(true)}
        onLogout={handleLogout}
      />
      <SearchOverlay open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}