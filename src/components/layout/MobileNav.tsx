"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckCircle, List, BarChart3, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { href: "/today", label: "Today", icon: CheckCircle },
  { href: "/habits", label: "Habits", icon: List },
  { href: "/analytics", label: "Stats", icon: BarChart3 },
  { href: "/profile", label: "More", icon: MoreHorizontal },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border z-40">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors min-w-[60px]",
                isActive ? "text-primary" : "text-text-muted"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[11px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
