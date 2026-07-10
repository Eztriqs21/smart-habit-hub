"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckCircle, List, BarChart3, Settings, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useUIStore } from "@/stores/ui-store";

const navItems = [
  { href: "/today", label: "Today", icon: CheckCircle },
  { href: "/habits", label: "Habits", icon: List },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/profile", label: "Profile", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col h-screen border-r border-border/50 bg-surface/80 glass sticky top-0 transition-all duration-200 z-30",
        sidebarCollapsed ? "w-[68px]" : "w-[240px]"
      )}
    >
      <div className={cn("flex items-center h-16 border-b border-border/50", sidebarCollapsed ? "justify-center px-2" : "px-5")}>
        {!sidebarCollapsed ? (
          <Link href="/today" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[8px] gradient-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              <span className="text-primary">Wellness</span>Hub
            </span>
          </Link>
        ) : (
          <Link href="/today" className="w-8 h-8 rounded-[8px] gradient-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </Link>
        )}
      </div>

      <nav className="flex-1 py-4 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-[10px] text-sm font-medium transition-all duration-150 mb-1",
                sidebarCollapsed ? "justify-center px-2 py-3" : "px-3 py-2.5",
                isActive
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-text-secondary hover:bg-surface-hover hover:text-foreground"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-2 border-t border-border/50">
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center w-full py-2 rounded-[10px] text-text-muted hover:bg-surface-hover hover:text-text-secondary transition-colors"
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
}
