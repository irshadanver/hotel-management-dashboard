"use client";

import Link from "next/link";
import { KeyboardEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Calendar, ChevronDown, Languages, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  clearSession,
  getStoredSession,
  type HotelUserSession,
} from "@/lib/auth/session";
import { searchMockData } from "@/lib/search/mock-search";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n/locale";
import { getActiveAlertCount } from "@/lib/api";
import { useGlobalDateFilter } from "@/lib/date/global-date-filter";

interface HeaderProps {
  sidebarCollapsed?: boolean;
}

export function Header({ sidebarCollapsed = false }: HeaderProps) {
  const [session, setSession] = useState<HotelUserSession | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const router = useRouter();
  const { direction, isRTL, toggleLocale, t } = useLocale();
  const {
    setPreset,
    triggerLabel,
    customStartDate,
    customEndDate,
    applyCustomDateRange,
    rangeQuery,
  } = useGlobalDateFilter();
  const criticalAlertCount = getActiveAlertCount(rangeQuery);

  useEffect(() => {
    setSession(getStoredSession());
  }, []);

  const [dateMenuOpen, setDateMenuOpen] = useState(false);
  const [draftStart, setDraftStart] = useState(customStartDate);
  const [draftEnd, setDraftEnd] = useState(customEndDate);

  useEffect(() => {
    if (dateMenuOpen) {
      setDraftStart(customStartDate);
      setDraftEnd(customEndDate);
    }
  }, [dateMenuOpen, customStartDate, customEndDate]);

  const searchResults = useMemo(
    () => searchMockData(searchQuery),
    [searchQuery]
  );

  const signOut = () => {
    clearSession();
    router.replace("/login");
  };

  const openResult = (href: string) => {
    setSearchOpen(false);
    setSearchQuery("");
    router.push(href);
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && searchResults[0]) {
      event.preventDefault();
      openResult(searchResults[0].href);
    }

    if (event.key === "Escape") {
      setSearchOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-6 transition-all duration-300 ${
        isRTL
          ? sidebarCollapsed
            ? "right-16"
            : "right-60"
          : sidebarCollapsed
            ? "left-16"
            : "left-60"
      } ${isRTL ? "left-0" : "right-0"}`}
    >
      {/* Left: Hotel Name & Search */}
      <div className="flex items-center gap-6">
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            {session?.propertyName ?? "Al Madinah Grand Hotel"}
          </h1>
          <p className="text-xs text-muted-foreground">
            {t.chain} {session?.chainId ?? "KSA"} · {t.property}{" "}
            {session?.propertyId ?? "MADINAH"}
          </p>
        </div>
        <div className="relative hidden lg:block">
          <div className="flex items-center gap-2 rounded-lg border border-input bg-secondary/50 px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              onKeyDown={handleSearchKeyDown}
              dir={direction}
              placeholder={t.searchPlaceholder}
              className="w-64 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          {searchOpen && searchQuery.trim().length >= 2 && (
            <div
              className={cn(
                "absolute top-11 z-50 w-[26rem] overflow-hidden rounded-lg border bg-popover shadow-lg",
                isRTL ? "right-0" : "left-0"
              )}
            >
              <div className="border-b px-3 py-2 text-xs text-muted-foreground">
                {t.searchResults}
              </div>
              {searchResults.length > 0 ? (
                <div className="max-h-80 overflow-y-auto py-1">
                  {searchResults.map((result) => (
                    <button
                      key={result.id}
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => openResult(result.href)}
                      className="flex w-full items-start gap-3 px-3 py-2 text-start hover:bg-muted"
                    >
                      <span className="mt-0.5 rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                        {result.module}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">
                          {result.title}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {result.subtitle}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                  {t.noMatches}
                </div>
              )}
              <div className="border-t px-3 py-2 text-[11px] text-muted-foreground">
                {t.searchHint}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Date, Notifications, Profile */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleLocale}
          className="gap-2"
        >
          <Languages className="h-4 w-4" />
          <span>{t.languageToggle}</span>
        </Button>

        {/* Date Selector */}
        <DropdownMenu open={dateMenuOpen} onOpenChange={setDateMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline max-w-[14rem] truncate">
                {triggerLabel}
              </span>
              <ChevronDown className="h-3 w-3 shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align={isRTL ? "start" : "end"}
            className="w-72 p-0"
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            <div className="p-1">
              <DropdownMenuItem onClick={() => setPreset("today")}>
                {t.today}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPreset("yesterday")}>
                {t.yesterday}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPreset("last7Days")}>
                {t.last7Days}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPreset("last30Days")}>
                {t.last30Days}
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator className="my-0" />
            <div
              className="space-y-3 p-3"
              onPointerDown={(e) => e.preventDefault()}
            >
              <p className="text-xs font-medium text-muted-foreground">
                {t.customRange}
              </p>
              <div className="grid gap-2">
                <label className="grid gap-1">
                  <span className="text-xs text-muted-foreground">
                    {t.dateFrom}
                  </span>
                  <input
                    type="date"
                    value={draftStart}
                    onChange={(e) => setDraftStart(e.target.value)}
                    className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                  />
                </label>
                <label className="grid gap-1">
                  <span className="text-xs text-muted-foreground">
                    {t.dateTo}
                  </span>
                  <input
                    type="date"
                    value={draftEnd}
                    onChange={(e) => setDraftEnd(e.target.value)}
                    className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                  />
                </label>
              </div>
              <Button
                type="button"
                size="sm"
                className="w-full"
                onClick={() => {
                  applyCustomDateRange(draftStart, draftEnd);
                  setDateMenuOpen(false);
                }}
              >
                {t.applyDateRange}
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="sm"
          className="relative"
          onClick={() => router.push("/alerts?severity=critical")}
          aria-label="Open critical alerts"
        >
          <Bell className="h-4 w-4" />
          {criticalAlertCount > 0 && (
            <span
              className={cn(
                "absolute -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium text-white",
                isRTL ? "-left-0.5" : "-right-0.5"
              )}
            >
              {criticalAlertCount}
            </span>
          )}
        </Button>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="hidden text-start md:block">
                <p className="text-sm font-medium">
                  {session?.name ?? t.hotelUser}
                </p>
                <p className="text-xs text-muted-foreground">
                  {session?.role ?? t.generalManager}
                </p>
              </div>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isRTL ? "start" : "end"} className="w-48">
            <DropdownMenuItem asChild>
              <Link href="/profile">{t.profileSettings}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/preferences">{t.preferences}</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut}>{t.signOut}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
