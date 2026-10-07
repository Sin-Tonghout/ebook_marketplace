"use client";

import {
  DesktopNavbar,
  type NavbarContentProps,
} from "@/components/layout/DesktopNavbar";
import { MobileNavbar } from "@/components/layout/MobileNavbar";
import { cn } from "@/lib/utils";

export function Navbar({
  className,
  ...props
}: NavbarContentProps & { className?: string }) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md",
        className
      )}
    >
      <DesktopNavbar {...props} />
      <MobileNavbar {...props} />
    </header>
  );
}