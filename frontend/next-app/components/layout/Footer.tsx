import Link from "next/link";

import { Logo } from "@/components/layout/Logo";

const columns = [
  {
    title: "Explore",
    links: [
      { label: "Books", href: "/books" },
      { label: "Categories", href: "/categories" },
      { label: "Authors", href: "/authors" },
    ],
  },
  {
    title: "Publish",
    links: [
      { label: "Sell your book", href: "/seller" },
      { label: "Seller studio", href: "/seller/books" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Help center", href: "/help" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-12 border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-14 md:px-10">
        <div className="grid gap-10 md:grid-cols-[1.5fr_repeat(4,1fr)]">
          <div className="space-y-3">
            <Logo />
            <p className="max-w-xs type-body-sm text-muted">
              A digital library to discover, read, collect, and publish stories
              worth keeping.
            </p>
          </div>

          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="type-label">{col.title}</h2>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="type-body-sm text-muted transition-colors duration-200 hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 type-caption sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} All rights reserved.</p>
          <p>Only publish books you have the right to distribute.</p>
        </div>
      </div>
    </footer>
  );
}