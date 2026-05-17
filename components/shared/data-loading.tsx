export function DataLoading({ label = "Loading..." }: { label?: string }) {
  return (
    <p className="py-8 text-center text-sm text-muted-foreground">{label}</p>
  );
}

export function DataError({ message }: { message: string }) {
  return (
    <p className="py-8 text-center text-sm text-destructive">{message}</p>
  );
}
