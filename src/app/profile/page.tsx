"use client";

import { useAuth } from "@/providers/AuthProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { AppShell } from "@/components/layout/AppShell";
import { Providers } from "@/providers";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useToast } from "@/providers/ToastProvider";
import { createClient } from "@/lib/supabase/client";
import { Monitor, Sun, Moon, LogOut } from "lucide-react";

function ProfileContent() {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const { showToast } = useToast();
  const supabase = createClient();

  const handleThemeChange = async (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    if (user) {
      await supabase
        .from("users")
        .update({ preferences: { ...user.preferences, theme: newTheme } })
        .eq("id", user.id);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    showToast("Signed out successfully", "success");
  };

  return (
    <AppShell>
      <div className="p-6 max-w-[560px] mx-auto">
        <h1 className="text-xl font-semibold text-foreground mb-6">Profile & Settings</h1>

        {/* Profile Card */}
        <Card className="mb-6">
          <div className="flex items-center gap-4">
            <Avatar name={user?.display_name || user?.email} size="lg" />
            <div>
              <p className="text-lg font-semibold text-foreground">
                {user?.display_name || "Wellness User"}
              </p>
              <p className="text-sm text-text-secondary">{user?.email}</p>
              <p className="text-[13px] text-text-muted mt-1">
                Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "today"}
              </p>
            </div>
          </div>
        </Card>

        {/* Theme */}
        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
          Appearance
        </h2>
        <Card className="mb-6">
          <p className="text-sm font-medium text-foreground mb-3">Theme</p>
          <div className="flex gap-2">
            {[
              { value: "system" as const, label: "System", icon: Monitor },
              { value: "light" as const, label: "Light", icon: Sun },
              { value: "dark" as const, label: "Dark", icon: Moon },
            ].map((t) => (
              <button
                key={t.value}
                onClick={() => handleThemeChange(t.value)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-[10px] border text-sm font-medium transition-all ${
                  theme === t.value
                    ? "border-primary bg-primary-subtle text-primary"
                    : "border-border bg-surface text-text-secondary hover:bg-surface-hover"
                }`}
              >
                <t.icon className="w-4 h-4" />
                {t.label}
              </button>
            ))}
          </div>
        </Card>

        {/* Sign Out */}
        <Button variant="ghost" onClick={handleSignOut} className="w-full text-error hover:bg-error-light">
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </AppShell>
  );
}

export default function ProfilePage() {
  return (
    <Providers>
      <AuthGuard>
        <ProfileContent />
      </AuthGuard>
    </Providers>
  );
}
