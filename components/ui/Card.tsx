import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-1 text-lg font-bold text-slate-900">{children}</h3>;
}

export function CardText({ children }: { children: React.ReactNode }) {
  return <p className="text-sm leading-relaxed text-slate-600">{children}</p>;
}
