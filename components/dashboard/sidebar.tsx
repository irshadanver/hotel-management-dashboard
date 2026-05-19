"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  BedDouble,
  TrendingUp,
  UtensilsCrossed,
  Package,
  Wallet,
  Bell,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getActiveAlertCount } from "@/lib/api";
import { useGlobalDateFilter } from "@/lib/date/global-date-filter";
import { useLocale } from "@/lib/i18n/locale";

interface SidebarProps {
  activeItem: string;
  onItemClick?: (item: string) => void;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { id: "rooms", label: "Rooms", icon: BedDouble, href: "/rooms" },
  { id: "revenue", label: "Revenue", icon: TrendingUp, href: "/revenue" },
  { id: "fnb", label: "F&B", icon: UtensilsCrossed, href: "/fnb" },
  { id: "inventory", label: "Inventory", icon: Package, href: "/inventory" },
  { id: "finance", label: "Finance", icon: Wallet, href: "/finance" },
  { id: "alerts", label: "Alerts", icon: Bell, href: "/alerts" },
];

export function Sidebar({
  activeItem,
  onItemClick,
  collapsed,
  onCollapsedChange,
}: SidebarProps) {
  const { isRTL, t } = useLocale();
  const { rangeQuery } = useGlobalDateFilter();
  const alertBadgeCount = getActiveAlertCount(rangeQuery);

  return (
    <aside
      className={cn(
        "fixed top-0 z-40 flex h-screen flex-col bg-sidebar text-sidebar-foreground transition-all duration-300",
        isRTL ? "right-0" : "left-0",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
              <span className="text-sm font-bold text-sidebar-primary-foreground">
                H
              </span>
            </div>
            <span className="text-sm font-semibold tracking-tight">
              HotelOS
            </span>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
            <span className="text-sm font-bold text-sidebar-primary-foreground">
              H
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const badge =
            item.id === "alerts" && alertBadgeCount > 0
              ? alertBadgeCount
              : item.badge;
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => onItemClick?.(item.id)}
              className={cn(
                "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-muted hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 text-start">
                    {t.nav[item.id as keyof typeof t.nav] ?? item.label}
                  </span>
                  {badge && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-xs font-medium text-white">
                      {badge}
                    </span>
                  )}
                </>
              )}
              {collapsed && badge && (
                <span
                  className={cn(
                    "absolute top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium text-white",
                    isRTL ? "right-10" : "left-10"
                  )}
                >
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="border-t border-sidebar-border p-3">
        <button
          onClick={() => onCollapsedChange(!collapsed)}
          className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-sidebar-muted transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
        >
          {collapsed ? (
            isRTL ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )
          ) : (
            <>
              {isRTL ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
              <span>{t.collapse}</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
