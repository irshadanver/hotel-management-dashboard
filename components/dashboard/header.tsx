"use client";

import Link from "next/link";
import { KeyboardEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Calendar, ChevronDown, Search, User } from "lucide-react";
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

interface HeaderProps {
  sidebarCollapsed?: boolean;
}

export function Header({ sidebarCollapsed = false }: HeaderProps) {
  const [session, setSession] = useState<HotelUserSession | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setSession(getStoredSession());
  }, []);

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
        sidebarCollapsed ? "left-16" : "left-60"
      } right-0`}
    >
      {/* Left: Hotel Name & Search */}
      <div className="flex items-center gap-6">
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            {session?.propertyName ?? "Al Madinah Grand Hotel"}
          </h1>
          <p className="text-xs text-muted-foreground">
            Chain {session?.chainId ?? "KSA"} · Property{" "}
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
              placeholder="Search rooms, guests, alerts..."
              className="w-64 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          {searchOpen && searchQuery.trim().length >= 2 && (
            <div className="absolute left-0 top-11 z-50 w-[26rem] overflow-hidden rounded-lg border bg-popover shadow-lg">
              <div className="border-b px-3 py-2 text-xs text-muted-foreground">
                Search results
              </div>
              {searchResults.length > 0 ? (
                <div className="max-h-80 overflow-y-auto py-1">
                  {searchResults.map((result) => (
                    <button
                      key={result.id}
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => openResult(result.href)}
                      className="flex w-full items-start gap-3 px-3 py-2 text-left hover:bg-muted"
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
                  No matches found
                </div>
              )}
              <div className="border-t px-3 py-2 text-[11px] text-muted-foreground">
                Press Enter to open the first result. API_REQUIRED: GET /api/search.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Date, Notifications, Profile */}
      <div className="flex items-center gap-4">
        {/* Date Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">May 14, 2026</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Today</DropdownMenuItem>
            <DropdownMenuItem>Yesterday</DropdownMenuItem>
            <DropdownMenuItem>Last 7 days</DropdownMenuItem>
            <DropdownMenuItem>Last 30 days</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Custom range...</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-white">
            3
          </span>
        </Button>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="hidden text-left md:block">
                <p className="text-sm font-medium">
                  {session?.name ?? "Hotel User"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {session?.role ?? "General Manager"}
                </p>
              </div>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link href="/profile">Profile Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/preferences">Preferences</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut}>Sign Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
