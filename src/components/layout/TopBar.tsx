"use client";

import { useAuth } from "@/providers/AuthProvider";
import { Avatar } from "@/components/ui/Avatar";
import { format } from "date-fns";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function TopBar() {
  const { user } = useAuth();
  const today = new Date();

  return (
    <header className="flex items-center justify-between h-16 px-6 border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-20">
      <div>
        <h1 className="text-lg font-semibold text-foreground">
          {getGreeting()}, {user?.display_name || "there"}
        </h1>
        <p className="text-sm text-text-secondary">{format(today, "EEE, MMM d")}</p>
      </div>
      <Avatar name={user?.display_name || user?.email} size="md" />
    </header>
  );
}
