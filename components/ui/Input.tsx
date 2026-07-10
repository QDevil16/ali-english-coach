import { cn } from "@/lib/utils";

export function Field({
  label,
  className,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </span>
      <input
        className={cn(
          "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none focus:border-brand focus:ring-2 focus:ring-brand-light",
          className,
        )}
        {...props}
      />
    </label>
  );
}

export function Alert({
  kind = "error",
  children,
}: {
  kind?: "error" | "success";
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl px-4 py-3 text-sm",
        kind === "error"
          ? "bg-red-50 text-red-700"
          : "bg-green-50 text-green-700",
      )}
    >
      {children}
    </div>
  );
}
