"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { BadgeVariant } from "./data-table";

// Panel card wrapper for side panels
interface PanelCardProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: {
    value: string | number;
    variant?: BadgeVariant;
  };
  action?: React.ReactNode;
  children: React.ReactNode;
  maxHeight?: string;
  className?: string;
}

export function PanelCard({
  title,
  subtitle,
  icon,
  badge,
  action,
  children,
  maxHeight = "400px",
  className,
}: PanelCardProps) {
  return (
    <Card className={cn("flex min-h-0 flex-col shadow-sm", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-semibold">{title}</CardTitle>
                {badge && (
                  <Badge variant={badge.variant || "secondary"} className="text-xs">
                    {badge.value}
                  </Badge>
                )}
              </div>
              {subtitle && (
                <p className="text-xs text-muted-foreground">{subtitle}</p>
              )}
            </div>
          </div>
          {action}
        </div>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full" style={{ maxHeight }}>
          <div className="px-4 pb-4">{children}</div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

// Panel list item
interface PanelListItemProps {
  title: string;
  subtitle?: string;
  value?: string | React.ReactNode;
  badge?: {
    label: string;
    variant?: BadgeVariant;
  };
  status?: {
    label: string;
    variant?: BadgeVariant;
  };
  highlight?: "warning" | "critical" | "success";
  leftBorder?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PanelListItem({
  title,
  subtitle,
  value,
  badge,
  status,
  highlight,
  leftBorder,
  action,
  className,
}: PanelListItemProps) {
  const highlightClasses = {
    warning: "bg-amber-50 border-l-2 border-l-amber-500",
    critical: "bg-red-50 border-l-2 border-l-red-500",
    success: "bg-emerald-50 border-l-2 border-l-emerald-500",
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-lg border px-3 py-2.5",
        highlight && highlightClasses[highlight],
        leftBorder && "border-l-2",
        className
      )}
      style={leftBorder && !highlight ? { borderLeftColor: leftBorder } : undefined}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="font-medium text-sm truncate">{title}</p>
          {badge && (
            <Badge variant={badge.variant || "outline"} className="text-[10px]">
              {badge.label}
            </Badge>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-2 ml-3 shrink-0">
        {value && (
          <span className="text-sm font-medium">{value}</span>
        )}
        {status && (
          <Badge variant={status.variant || "secondary"} className="text-[10px]">
            {status.label}
          </Badge>
        )}
        {action}
      </div>
    </div>
  );
}

// Approval button for pending items
interface ApprovalButtonsProps {
  onApprove?: () => void;
  onReject?: () => void;
  size?: "sm" | "default";
}

export function ApprovalButtons({
  onApprove,
  onReject,
  size = "sm",
}: ApprovalButtonsProps) {
  return (
    <div className="flex gap-1">
      <Button
        variant="ghost"
        size={size === "sm" ? "icon" : "default"}
        className="h-7 w-7 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700"
        onClick={onApprove}
      >
        <span className="sr-only">Approve</span>
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </Button>
      {onReject && (
        <Button
          variant="ghost"
          size={size === "sm" ? "icon" : "default"}
          className="h-7 w-7 text-red-600 hover:bg-red-100 hover:text-red-700"
          onClick={onReject}
        >
          <span className="sr-only">Reject</span>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Button>
      )}
    </div>
  );
}

// Alert/Exception list item
interface AlertItemProps {
  type: string;
  description: string;
  count?: number;
  severity: "critical" | "warning" | "info";
  timestamp?: string;
  action?: React.ReactNode;
}

const severityConfig = {
  critical: { variant: "destructive" as const, bgClass: "bg-red-50 border-l-red-500" },
  warning: { variant: "secondary" as const, bgClass: "bg-amber-50 border-l-amber-500" },
  info: { variant: "outline" as const, bgClass: "bg-blue-50 border-l-blue-500" },
};

export function AlertItem({
  type,
  description,
  count,
  severity,
  timestamp,
  action,
}: AlertItemProps) {
  const config = severityConfig[severity];
  
  return (
    <div
      className={cn(
        "flex items-start justify-between rounded-lg border border-l-2 p-3",
        config.bgClass
      )}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Badge variant={config.variant} className="text-[10px]">
            {severity.charAt(0).toUpperCase() + severity.slice(1)}
          </Badge>
          <span className="font-medium text-sm">{type}</span>
          {count !== undefined && (
            <Badge variant="outline" className="text-[10px]">
              {count}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
        {timestamp && (
          <p className="text-[10px] text-muted-foreground mt-1">{timestamp}</p>
        )}
      </div>
      {action && <div className="ml-3 shrink-0">{action}</div>}
    </div>
  );
}
