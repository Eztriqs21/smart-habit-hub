"use client";

import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/providers/ToastProvider";
import { AppShell } from "@/components/layout/AppShell";
import { Providers } from "@/providers";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { HabitCard } from "@/components/habits/HabitCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { DimensionBar } from "@/components/dimensions/DimensionBar";
import { Skeleton } from "@/components/ui/Skeleton";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import { type Habit, type HabitLog, type Dimension } from "@/types";

function TodayContent() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const supabase = createClient();
  const today = format(new Date(), "yyyy-MM-dd");
  const [selectedDate, setSelectedDate] = useState(today);

  const { data: habits = [], isLoading: habitsLoading } = useQuery({
    queryKey: ["habits"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("habits")
        .select("*")
        .eq("user_id", user!.id)
        .eq("is_archived", false)
        .order("sort_order");
      if (error) throw error;
      return data as Habit[];
    },
    enabled: !!user,
  });

  const { data: logs = [], isLoading: logsLoading } = useQuery({
    queryKey: ["logs", selectedDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("habit_logs")
        .select("*")
        .eq("user_id", user!.id)
        .eq("log_date", selectedDate);
      if (error) throw error;
      return data as HabitLog[];
    },
    enabled: !!user,
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ habitId, currentlyCompleted }: { habitId: string; currentlyCompleted: boolean }) => {
      if (currentlyCompleted) {
        const existing = logs.find((l) => l.habit_id === habitId);
        if (existing) {
          const { error } = await supabase.from("habit_logs").delete().eq("id", existing.id);
          if (error) throw error;
        }
      } else {
        const { error } = await supabase.from("habit_logs").upsert(
          {
            user_id: user!.id,
            habit_id: habitId,
            log_date: selectedDate,
            status: "completed",
          },
          { onConflict: "habit_id,log_date" }
        );
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logs", selectedDate] });
    },
    onError: () => {
      showToast("Something went wrong. Please try again.", "error");
    },
  });

  const handleToggle = useCallback(
    (habitId: string) => {
      const isCompleted = logs.some((l) => l.habit_id === habitId && l.status === "completed");
      toggleMutation.mutate({ habitId, currentlyCompleted: isCompleted });
    },
    [logs, toggleMutation]
  );

  const completedCount = habits.filter((h) =>
    logs.some((l) => l.habit_id === h.id && l.status === "completed")
  ).length;

  const dimensionScores: Record<Dimension, number> = {
    body: 0,
    mind: 0,
    lifestyle: 0,
  };

  (["body", "mind", "lifestyle"] as Dimension[]).forEach((dim) => {
    const dimHabits = habits.filter((h) => h.dimension === dim);
    if (dimHabits.length > 0) {
      const done = dimHabits.filter((h) =>
        logs.some((l) => l.habit_id === h.id && l.status === "completed")
      ).length;
      dimensionScores[dim] = Math.round((done / dimHabits.length) * 100);
    }
  });

  if (habitsLoading || logsLoading) {
    return (
      <AppShell>
        <div className="p-6 max-w-3xl mx-auto space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="p-6 max-w-3xl mx-auto">
        {/* Dimension Summary */}
        {habits.length > 0 && (
          <div className="flex gap-3 mb-6 flex-wrap">
            <DimensionBar dimension="body" score={dimensionScores.body} compact />
            <DimensionBar dimension="mind" score={dimensionScores.mind} compact />
            <DimensionBar dimension="lifestyle" score={dimensionScores.lifestyle} compact />
          </div>
        )}

        {/* Habits List */}
        {habits.length === 0 ? (
          <EmptyState
            title="Start your journey"
            description="Create your first habit and begin tracking your wellness."
            action={
              <a href="/habits">
                <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-[10px] text-sm font-medium hover:bg-primary-hover transition-colors">
                  <Plus className="w-4 h-4" />
                  Create First Habit
                </button>
              </a>
            }
          />
        ) : (
          <>
            <div className="space-y-3 mb-6">
              {habits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  isCompleted={logs.some(
                    (l) => l.habit_id === habit.id && l.status === "completed"
                  )}
                  onToggle={() => handleToggle(habit.id)}
                />
              ))}
            </div>

            {/* Overall Progress */}
            <div className="bg-surface border border-border rounded-[10px] p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Today&apos;s Progress</span>
                <span className="text-sm text-text-secondary">
                  {completedCount}/{habits.length}
                </span>
              </div>
              <ProgressBar
                value={completedCount}
                max={habits.length}
                size="sm"
              />
            </div>

            {completedCount === habits.length && habits.length > 0 && (
              <div className="mt-4 text-center p-4 bg-success-light rounded-[10px]">
                <p className="text-sm font-medium text-success">
                  Perfect day! You&apos;ve completed all habits.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}

export default function TodayPage() {
  return (
    <Providers>
      <AuthGuard>
        <TodayContent />
      </AuthGuard>
    </Providers>
  );
}
