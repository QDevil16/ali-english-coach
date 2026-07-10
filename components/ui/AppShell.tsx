import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { BottomNav } from "@/components/ui/BottomNav";
import { SignOutButton } from "@/components/auth/SignOutButton";

export function AppShell({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen pb-20">
      <header className="border-b border-slate-200 bg-white">
        <Container className="flex items-center justify-between py-3">
          <Link href="/dashboard" className="text-base font-bold text-slate-900">
            {title}
          </Link>
          <div className="flex items-center gap-1">
            {action}
            <Link
              href="/settings"
              className="px-3 py-2 text-sm text-slate-500 hover:text-slate-800"
            >
              Ayarlar
            </Link>
            <SignOutButton />
          </div>
        </Container>
      </header>
      <main className="py-6">
        <Container>{children}</Container>
      </main>
      <BottomNav />
    </div>
  );
}
