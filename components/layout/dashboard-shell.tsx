"use client";

import {
  useEffect,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { cn } from "@/lib/utils";
import {
  getStoredSession,
  touchSessionActivity,
} from "@/lib/auth/session";
import { useLocale } from "@/lib/i18n/locale";

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
  /** null = not checked yet (avoid flashing dashboard before redirect). */
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { isRTL, t, tr } = useLocale();

  useLayoutEffect(() => {
    const session = getStoredSession();
    if (session) {
      touchSessionActivity();
      setAuthorized(true);
      return;
    }

    setAuthorized(false);
    router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [pathname, router]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible" && getStoredSession()) {
        touchSessionActivity();
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  if (authorized === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        {t.checkingSession}
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        {t.checkingSession}
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
          isRTL
            ? sidebarCollapsed
              ? "pr-16"
              : "pr-60"
            : sidebarCollapsed
              ? "pl-16"
              : "pl-60"
        )}
      >
        <div className="flex">
          <div className="flex-1 space-y-6 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">{tr(title)}</h2>
                {subtitle && (
                  <p className="text-sm text-muted-foreground">{tr(subtitle)}</p>
                )}
              </div>
              {headerActions}
            </div>
            {children}
          </div>
          {rightPanel && (
            <aside
              className={cn(
                "w-80 shrink-0 bg-muted/30 p-6",
                isRTL ? "border-r" : "border-l"
              )}
            >
              {rightPanel}
            </aside>
          )}
        </div>
      </main>
    </div>
  );
}
