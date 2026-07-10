"use client";

import { useAuth } from "@/providers/AuthProvider";
import { Avatar } from "@/components/ui/Avatar";
import { format } from "date-fns";

export function TopBar() {
  const { user } = useAuth();
  const today = new Date();

  return (
    <header className="flex items-center justify-between h-16 px-6 lg:px-8 border-b border-border/50 glass-strong bg-surface/70 sticky top-0 z-20">
      <div>
        <p className="text-sm text-text-muted">{format(today, "EEE, MMM d")}</p>
      </div>
      <Avatar name={user?.display_name || user?.email} size="md" />
    </header>
  );
}
