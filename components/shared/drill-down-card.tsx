"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DrillDownCardProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}

/** Clickable wrapper — navigates to drill-down page */
export function DrillDownCard({
  href,
  children,
  className,
  ariaLabel,
}: DrillDownCardProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={cn(
        "group relative block rounded-xl transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&>*]:h-full",
        className
      )}
    >
      {children}
      <ChevronRight
        className="absolute right-3 top-3 h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
        aria-hidden
      />
    </Link>
  );
}
