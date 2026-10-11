"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/seller", label: "Dashboard", exact: true },
  { href: "/seller/books", label: "My books", exact: false },
  { href: "/seller/analytics", label: "Analytics", exact: false },
  { href: "/seller/orders", label: "Orders", exact: false },
  
  { href: "/seller/profile", label: "Profile", exact: false },
];

export function SellerNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Seller" className="border-b border-border">
      <ul className="-mb-px flex gap-1 overflow-x-auto">
        {ITEMS.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-12 items-center border-b-2 px-4 text-sm font-medium transition-colors duration-(--duration-fast)",
                  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent",
                  active
                    ? "border-accent text-foreground"
                    : "border-transparent text-muted hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}