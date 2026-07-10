"use client";

import { useCallback, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/providers/ToastProvider";
import { AppShell } from "@/components/layout/AppShell";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { HabitCard } from "@/components/habits/HabitCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { DimensionBar } from "@/components/dimensions/DimensionBar";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { PageTransition, staggerContainer, staggerItem } from "@/components/ui/PageTransition";
import { fireConfetti } from "@/lib/utils/confetti";
import { motion } from "framer-motion";
import { Plus, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { type Habit, type HabitLog, type Dimension } from "@/types";
import { MOTIVATIONAL_QUOTES } from "@/lib/constants/dimensions";

function TodayContent() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const supabase = createClient();
  const today = format(new Date(), "yyyy-MM-dd");
  const confettiFired = useRef(false);

  const quote = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86400000);
    return MOTIVATIONAL_QUOTES[dayOfYear % MOTIVATIONAL_QUOTES.length];
  }, []);

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
    queryKey: ["logs", today],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("habit_logs")
        .select("*")
        .eq("user_id", user!.id)
        .eq("log_date", today);
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
            log_date: today,
            status: "completed",
          },
          { onConflict: "habit_id,log_date" }
        );
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logs", today] });
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

  const allDone = completedCount === habits.length && habits.length > 0;

  useEffect(() => {
    if (allDone && !confettiFired.current) {
      confettiFired.current = true;
      fireConfetti();
    }
  }, [allDone]);

  const dimensionScores: Record<Dimension, number> = { body: 0, mind: 0, lifestyle: 0 };
  (["body", "mind", "lifestyle"] as Dimension[]).forEach((dim) => {
    const dimHabits = habits.filter((h) => h.dimension === dim);
    if (dimHabits.length > 0) {
      const done = dimHabits.filter((h) =>
        logs.some((l) => l.habit_id === h.id && l.status === "completed")
      ).length;
      dimensionScores[dim] = Math.round((done / dimHabits.length) * 100);
    }
  });

  const progress = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  })();

  if (habitsLoading || logsLoading) {
    return (
      <AppShell>
        <div className="p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-6 w-96" />
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-18 w-full" />
            <Skeleton className="h-18 w-full" />
            <Skeleton className="h-18 w-full" />
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="p-6 lg:p-8 max-w-3xl mx-auto">
        <PageTransition>
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-title text-foreground mb-1">
              {greeting}, {user?.display_name || "there"}
            </h1>
            <p className="text-sm text-text-secondary italic">&ldquo;{quote}&rdquo;</p>
          </div>

          {/* Progress + Dimension Summary */}
          {habits.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex items-center gap-4 bg-surface border border-border rounded-[14px] p-5 flex-shrink-0">
                <div className="relative">
                  <ProgressRing value={progress} size={72} strokeWidth={5} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-foreground">{progress}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Today&apos;s Progress</p>
                  <p className="text-xs text-text-muted">{completedCount} of {habits.length} habits</p>
                </div>
              </div>
              <div className="flex gap-3 flex-wrap flex-1">
                <DimensionBar dimension="body" score={dimensionScores.body} compact />
                <DimensionBar dimension="mind" score={dimensionScores.mind} compact />
                <DimensionBar dimension="lifestyle" score={dimensionScores.lifestyle} compact />
              </div>
            </div>
          )}

          {/* Habits List */}
          {habits.length === 0 ? (
            <EmptyState
              title="Start your journey"
              description="Create your first habit and begin tracking your wellness."
              action={
                <Link href="/habits">
                  <Button>
                    <Plus className="w-4 h-4 mr-1" />
                    Create First Habit
                  </Button>
                </Link>
              }
            />
          ) : (
            <>
              <motion.div
                className="space-y-3 mb-6"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {habits.map((habit) => (
                  <motion.div key={habit.id} variants={staggerItem}>
                    <HabitCard
                      habit={habit}
                      isCompleted={logs.some(
                        (l) => l.habit_id === habit.id && l.status === "completed"
                      )}
                      onToggle={() => handleToggle(habit.id)}
                    />
                  </motion.div>
                ))}
              </motion.div>

              {allDone && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-success-light to-primary-subtle rounded-[14px] border border-success/20"
                >
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Perfect day!</p>
                    <p className="text-xs text-text-secondary">You&apos;ve completed all your habits. Amazing work.</p>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </PageTransition>
      </div>
    </AppShell>
  );
}

export default function TodayPage() {
  return (
    <AuthGuard>
      <TodayContent />
    </AuthGuard>
  );
}
