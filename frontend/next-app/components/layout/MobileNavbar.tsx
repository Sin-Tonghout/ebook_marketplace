"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Search } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import type { NavbarContentProps } from "@/components/layout/DesktopNavbar";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { IconButton } from "@/components/ui/IconButton";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { mainNav } from "@/lib/navigation";

const linkClass =
  "flex min-h-12 items-center rounded-md px-3 text-lg transition-colors duration-(--duration-fast) hover:bg-surface-soft";

export function MobileNavbar({ user, onSearchOpen, onLogout }: NavbarContentProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  const links = [
    ...mainNav,
    { label: "Library", href: "/library" },
    { label: "Sell", href: "/seller" },
  ];

  return (
    <>
      <div className="flex h-14 items-center justify-between px-4 md:hidden">
        <Logo />
        <div className="flex items-center gap-1">
          <IconButton label="Search" onClick={onSearchOpen}>
            <Search className="size-5" aria-hidden />
          </IconButton>
          <IconButton label="Open menu" onClick={() => setOpen(true)}>
            <Menu className="size-5" aria-hidden />
          </IconButton>
        </div>
      </div>

      <Drawer open={open} onOpenChange={setOpen} side="left" title="Menu">
        <nav aria-label="Mobile" className="flex h-full flex-col">
          <ul className="space-y-1">
            {links.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={linkClass}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-8 space-y-4 border-t border-border pt-6">
            {user ? (
              <>
                <div className="flex items-center gap-3 px-3">
                  <Avatar name={user.name} src={user.avatarUrl} />
                  <div className="min-w-0">
                    <p className="truncate type-label">{user.name}</p>
                    <p className="truncate type-caption">{user.email}</p>
                  </div>
                </div>
                <Link href="/profile" className={linkClass} onClick={() => setOpen(false)}>
                  Profile
                </Link>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => {
                    setOpen(false);
                    onLogout();
                  }}
                >
                  Log out
                </Button>
              </>
            ) : (
              <div className="grid gap-3">
                <Button size="lg" onClick={() => go("/register")}>
                  Sign up
                </Button>
                <Button size="lg" variant="secondary" onClick={() => go("/login")}>
                  Log in
                </Button>
              </div>
            )}
            <div className="flex items-center justify-between px-3">
              <span className="type-body-sm text-muted">Appearance</span>
              <ThemeToggle />
            </div>
          </div>
        </nav>
      </Drawer>
    </>
  );
}