export function ListContainer({ children, className }: { 
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div 
      className={`flex flex-col mt-3 rounded-2xl bg-neutral-900 ${className ? className : ""}`}
    >
      {children}
    </div>
  );
}