"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { AppShell } from "@/components/layout/AppShell";
import { Providers } from "@/providers";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { DimensionBar } from "@/components/dimensions/DimensionBar";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { TrendingUp, Flame, CheckCircle, Calendar } from "lucide-react";
import { type Habit, type HabitLog, type Dimension } from "@/types";

function AnalyticsContent() {
  const { user } = useAuth();
  const supabase = createClient();

  const { data: habits = [], isLoading: habitsLoading } = useQuery({
    queryKey: ["habits"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("habits")
        .select("*")
        .eq("user_id", user!.id)
        .eq("is_archived", false);
      if (error) throw error;
      return data as Habit[];
    },
    enabled: !!user,
  });

  const { data: logs = [], isLoading: logsLoading } = useQuery({
    queryKey: ["logs-range", "30d"],
    queryFn: async () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const { data, error } = await supabase
        .from("habit_logs")
        .select("*")
        .eq("user_id", user!.id)
        .gte("log_date", thirtyDaysAgo.toISOString().split("T")[0]);
      if (error) throw error;
      return data as HabitLog[];
    },
    enabled: !!user,
  });

  const isLoading = habitsLoading || logsLoading;

  const totalCompleted = logs.filter((l) => l.status === "completed").length;
  const totalExpected = habits.length * 30; // rough estimate
  const completionRate = totalExpected > 0 ? Math.round((totalCompleted / totalExpected) * 100) : 0;

  const dimensionScores: Record<Dimension, number> = { body: 0, mind: 0, lifestyle: 0 };
  (["body", "mind", "lifestyle"] as Dimension[]).forEach((dim) => {
    const dimHabits = habits.filter((h) => h.dimension === dim);
    if (dimHabits.length > 0) {
      const dimLogs = logs.filter((l) => dimHabits.some((h) => h.id === l.habit_id) && l.status === "completed");
      dimensionScores[dim] = Math.round((dimLogs.length / (dimHabits.length * 30)) * 100);
    }
  });

  if (isLoading) {
    return (
      <AppShell>
        <div className="p-6 max-w-3xl mx-auto space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-24 w-full" variant="rectangular" />
            <Skeleton className="h-24 w-full" variant="rectangular" />
            <Skeleton className="h-24 w-full" variant="rectangular" />
            <Skeleton className="h-24 w-full" variant="rectangular" />
          </div>
        </div>
      </AppShell>
    );
  }

  if (habits.length === 0) {
    return (
      <AppShell>
        <div className="p-6 max-w-3xl mx-auto">
          <h1 className="text-xl font-semibold text-foreground mb-6">Analytics</h1>
          <EmptyState
            title="No data yet"
            description="Start tracking habits to see your analytics."
            action={
              <a href="/habits" className="text-primary text-sm font-medium hover:underline">
                Create a habit
              </a>
            }
          />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-xl font-semibold text-foreground mb-6">Analytics</h1>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-subtle flex items-center justify-center">
                <Flame className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{completionRate}%</p>
                <p className="text-[13px] text-text-muted">Completion (30d)</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success-light flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalCompleted}</p>
                <p className="text-[13px] text-text-muted">Habits completed</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent-light flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{habits.length}</p>
                <p className="text-[13px] text-text-muted">Active habits</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning-light flex items-center justify-center">
                <Calendar className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">30</p>
                <p className="text-[13px] text-text-muted">Days tracked</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Dimension Scores */}
        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
          Wellness Dimensions
        </h2>
        <div className="grid gap-4 mb-8">
          <DimensionBar dimension="body" score={dimensionScores.body} />
          <DimensionBar dimension="mind" score={dimensionScores.mind} />
          <DimensionBar dimension="lifestyle" score={dimensionScores.lifestyle} />
        </div>

        {/* Insight Placeholder */}
        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
          Insights
        </h2>
        <Card>
          <p className="text-sm text-text-secondary">
            Keep tracking for a week to unlock personalized insights about your habits and patterns.
          </p>
        </Card>
      </div>
    </AppShell>
  );
}

export default function AnalyticsPage() {
  return (
    <Providers>
      <AuthGuard>
        <AnalyticsContent />
      </AuthGuard>
    </Providers>
  );
}
