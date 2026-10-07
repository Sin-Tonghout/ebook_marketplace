"use client";

import { useRouter } from "next/navigation";
import {
  BookOpen,
  Heart,
  LayoutDashboard,
  LogOut,
  Receipt,
  Settings,
  Shield,
  User,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Dropdown, type DropdownItem } from "@/components/ui/Dropdown";
import type { NavUser } from "@/types/user";

export interface UserMenuProps {
  user: NavUser | null;
  onLogout: () => void;
}

export function UserMenu({ user, onLogout }: UserMenuProps) {
  const router = useRouter();

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => router.push("/login")}>
          Log in
        </Button>
        <Button size="sm" onClick={() => router.push("/register")}>
          Sign up
        </Button>
      </div>
    );
  }

  const icon = "size-4";
  const items: DropdownItem[] = [
    { label: "Profile", icon: <User className={icon} />, onSelect: () => router.push("/profile") },
    { label: "My library", icon: <BookOpen className={icon} />, onSelect: () => router.push("/library") },
    { label: "Favorites", icon: <Heart className={icon} />, onSelect: () => router.push("/favorites") },
    { label: "Orders", icon: <Receipt className={icon} />, onSelect: () => router.push("/orders") },
    {
      label: user.role === "reader" ? "Become a seller" : "Seller dashboard",
      icon: <LayoutDashboard className={icon} />,
      onSelect: () => router.push("/seller"),
    },
    ...(user.role === "admin"
      ? [{ label: "Admin", icon: <Shield className={icon} />, onSelect: () => router.push("/admin") }]
      : []),
    { label: "Settings", icon: <Settings className={icon} />, onSelect: () => router.push("/settings") },
    { label: "Log out", icon: <LogOut className={icon} />, danger: true, onSelect: onLogout },
  ];

  return (
    <Dropdown
      trigger={
        <button
          type="button"
          aria-label={`Account menu for ${user.name}`}
          className="rounded-full transition duration-(--duration-fast) hover:ring-2 hover:ring-border"
        >
          <Avatar name={user.name} src={user.avatarUrl} size="md" />
        </button>
      }
      items={items}
    />
  );
}