import { Logo } from "@/components/layout/Logo";
import { NavLink } from "@/components/layout/NavLink";
import { SearchBar } from "@/components/layout/SearchBar";
import { UserMenu } from "@/components/layout/UserMenu";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { mainNav } from "@/lib/navigation";
import type { NavUser } from "@/types/user";

export interface NavbarContentProps {
  user: NavUser | null;
  onSearchOpen: () => void;
  onLogout: () => void;
}

export function DesktopNavbar({ user, onSearchOpen, onLogout }: NavbarContentProps) {
  return (
    <nav
      aria-label="Main"
      className="mx-auto hidden h-16 max-w-7xl items-center gap-8 px-6 md:flex"
    >
      <Logo />

      <ul className="flex items-center gap-6">
        {mainNav.map((item) => (
          <li key={item.href}>
            <NavLink href={item.href}>{item.label}</NavLink>
          </li>
        ))}
      </ul>

      <div className="mx-auto w-full max-w-md">
        <SearchBar onOpen={onSearchOpen} />
      </div>

      <div className="flex items-center gap-5">
        <NavLink href="/library">Library</NavLink>
        <NavLink href="/seller">Sell</NavLink>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserMenu user={user} onLogout={onLogout} />
        </div>
      </div>
    </nav>
  );
}