"use client";

import { useState } from "react";
import { BarChart3, BookOpen, LayoutDashboard, ShoppingBag, Wallet } from "lucide-react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import type { NavUser } from "@/types/user";

const users: Record<string, NavUser | null> = {
  Guest: null,
  Reader: { name: "Sophea Chan", email: "sophea@example.com", role: "reader" },
  Seller: { name: "Dara Lim", email: "dara@example.com", role: "seller" },
  Admin: { name: "Maya Whitfield", email: "maya@example.com", role: "admin" },
};

export default function NavDemo() {
  const [who, setWho] = useState<keyof typeof users>("Guest");
  const { toast } = useToast();

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center gap-3">
        <span className="type-label">Viewing as:</span>
        {Object.keys(users).map((name) => (
          <Button
            key={name}
            size="sm"
            variant={who === name ? "primary" : "secondary"}
            onClick={() => setWho(name)}
          >
            {name}
          </Button>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <Navbar
          className="static"
          user={users[who]}
          onSearchOpen={() => toast({ title: "Search opens here (Phase 05)" })}
          onLogout={() => {
            setWho("Guest");
            toast({ title: "Logged out" });
          }}
        />
      </div>

      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Books", href: "/books" },
          { label: "Design", href: "/books?category=design" },
          { label: "The Future of Design" },
        ]}
      />

      <Sidebar
        title="Seller studio"
        activeHref="/seller/books"
        items={[
          { label: "Dashboard", href: "/seller", icon: LayoutDashboard },
          { label: "My books", href: "/seller/books", icon: BookOpen, badge: 14 },
          { label: "Orders", href: "/seller/orders", icon: ShoppingBag },
          { label: "Analytics", href: "/seller/analytics", icon: BarChart3 },
          { label: "Earnings", href: "/seller/earnings", icon: Wallet },
        ]}
      />
    </div>
  );
}