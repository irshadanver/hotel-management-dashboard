 "use client";

import { useLocale } from "@/lib/i18n/locale";

export function DataLoading({ label = "Loading…" }: { label?: string }) {
  const { tr } = useLocale();

  return (
    <p className="py-8 text-center text-sm text-muted-foreground">{tr(label)}</p>
  );
}

export function DataError({ message }: { message: string }) {
  const { tr } = useLocale();

  return (
    <p className="py-8 text-center text-sm text-destructive">{tr(message)}</p>
  );
}
