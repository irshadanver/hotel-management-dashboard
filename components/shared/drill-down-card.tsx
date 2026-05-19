"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n/locale";

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
  const { isRTL } = useLocale();
  const Icon = isRTL ? ChevronLeft : ChevronRight;

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
      <Icon
        className={cn(
          "absolute top-3 h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100",
          isRTL ? "left-3" : "right-3"
        )}
        aria-hidden
      />
    </Link>
  );
}
