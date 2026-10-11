import { RequireAuth } from "@/components/auth/RequireAuth";
import { Footer } from "@/components/layout/Footer";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SellerNav } from "@/components/seller/SellerNav";
import { cn } from "@/lib/utils";

export function SellerShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <RequireAuth roles={["seller"]}>
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <div className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6 lg:px-8">
          <SellerNav />
        </div>
        <main
          className={cn(
            "mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:px-8",
            className
          )}
        >
          {children}
        </main>
        <Footer />
      </div>
    </RequireAuth>
  );
}