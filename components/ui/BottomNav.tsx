"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/dashboard", label: "Panel" },
  { href: "/curriculum", label: "Plan" },
  { href: "/lesson/today", label: "Ders" },
  { href: "/mistakes", label: "Hatalar" },
  { href: "/progress", label: "İlerleme" },
];

export function BottomNav() {
  const path = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-md">
        {ITEMS.map((it) => {
          const active = path === it.href || path.startsWith(it.href + "/");
          return (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                "flex-1 py-3 text-center text-xs font-medium",
                active ? "text-brand" : "text-slate-500",
              )}
            >
              {it.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
