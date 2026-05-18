"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { cn } from "@/lib/utils";
import { getStoredSession } from "@/lib/auth/session";

export type NavItemId =
  | "dashboard"
  | "rooms"
  | "revenue"
  | "fnb"
  | "inventory"
  | "finance"
  | "alerts";

interface DashboardShellProps {
  activeItem: NavItemId;
  title: string;
  subtitle?: string;
  children: ReactNode;
  rightPanel?: ReactNode;
  headerActions?: ReactNode;
}

export function DashboardShell({
  activeItem,
  title,
  subtitle,
  children,
  rightPanel,
  headerActions,
}: DashboardShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (getStoredSession()) {
      setAuthorized(true);
      return;
    }

    router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [pathname, router]);

  if (!authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Checking session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        activeItem={activeItem}
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />

      <Header sidebarCollapsed={sidebarCollapsed} />

      <main
        className={cn(
          "min-h-screen pt-16 transition-all duration-300",
          sidebarCollapsed ? "pl-16" : "pl-60"
        )}
      >
        <div className="flex">
          <div className="flex-1 space-y-6 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
                {subtitle && (
                  <p className="text-sm text-muted-foreground">{subtitle}</p>
                )}
              </div>
              {headerActions}
            </div>
            {children}
          </div>
          {rightPanel && (
            <aside className="w-80 shrink-0 border-l bg-muted/30 p-6">
              {rightPanel}
            </aside>
          )}
        </div>
      </main>
    </div>
  );
}
