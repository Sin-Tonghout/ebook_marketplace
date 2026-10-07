export const mainNav = [
  { label: "Books", href: "/books" },
  { label: "Categories", href: "/categories" },
  { label: "Authors", href: "/authors" },
];

export function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}