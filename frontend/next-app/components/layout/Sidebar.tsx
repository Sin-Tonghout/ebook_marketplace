"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { isActivePath } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export interface SidebarItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
}

export interface SidebarProps {
  title: string;
  items: SidebarItem[];
  activeHref?: string; // override, useful for demos
  className?: string;
}

export function Sidebar({ title, items, activeHref, className }: SidebarProps) {
  const pathname = usePathname();
  const current = activeHref ?? pathname;

  return (
    <nav aria-label={title} className={cn("w-60 space-y-2", className)}>
      <p className="px-3 type-caption uppercase tracking-widest">{title}</p>
      <ul className="space-y-1">
        {items.map(({ label, href, icon: Icon, badge }) => {
          const active = isActivePath(current, href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium",
                  "transition-colors duration-(--duration-fast)",
                  active
                    ? "bg-surface-soft text-foreground"
                    : "text-muted hover:bg-surface-soft hover:text-foreground"
                )}
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                <span className="flex-1">{label}</span>
                {badge !== undefined && (
                  <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs text-foreground">
                    {badge}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}