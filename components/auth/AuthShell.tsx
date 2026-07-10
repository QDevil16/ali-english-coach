import Link from "next/link";
import { Container } from "@/components/ui/Container";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col justify-center py-10">
      <Container>
        <Link
          href="/"
          className="mb-8 block text-center text-sm font-semibold text-brand"
        >
          Ali English Coach
        </Link>
        <h1 className="mb-1 text-2xl font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="mb-6 text-sm text-slate-600">{subtitle}</p>}
        <div className="space-y-4">{children}</div>
        {footer && <div className="mt-6 text-center text-sm">{footer}</div>}
      </Container>
    </main>
  );
}
