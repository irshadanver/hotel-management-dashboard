"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface DetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function DetailDrawer({
  open,
  onOpenChange,
  title,
  description,
  children,
}: DetailDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto px-5 sm:max-w-md sm:px-6">
        <SheetHeader className="px-0 pb-2 pr-8 pt-5">
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        <div className="mx-auto w-full max-w-sm space-y-4 pb-6">{children}</div>
      </SheetContent>
    </Sheet>
  );
}
