export function Spinner({ className = "size-4" }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`${className} shrink-0 animate-spin rounded-full border-4 border-current border-t-transparent`} />
  );
}
