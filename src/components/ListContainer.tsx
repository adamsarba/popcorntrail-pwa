export function ListContainer({
  children,
  className,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`mt-3 flex flex-col rounded-2xl bg-neutral-900 ${className ? className : ""}`}
    >
      {children}
    </div>
  );
}
