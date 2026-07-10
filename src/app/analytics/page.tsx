"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { DimensionBar } from "@/components/dimensions/DimensionBar";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { PageTransition, staggerContainer, staggerItem } from "@/components/ui/PageTransition";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { motion } from "framer-motion";
import { TrendingUp, Flame, CheckCircle, Calendar, BarChart3 } from "lucide-react";
import { type Habit, type HabitLog, type Dimension } from "@/types";
import Link from "next/link";

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
  const totalExpected = habits.length * 30;
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
        <div className="p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
          <Skeleton className="h-10 w-48" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-24" variant="rectangular" />
            <Skeleton className="h-24" variant="rectangular" />
            <Skeleton className="h-24" variant="rectangular" />
            <Skeleton className="h-24" variant="rectangular" />
          </div>
        </div>
      </AppShell>
    );
  }

  if (habits.length === 0) {
    return (
      <AppShell>
        <div className="p-6 lg:p-8 max-w-3xl mx-auto">
          <h1 className="text-title text-foreground mb-6">Analytics</h1>
          <EmptyState
            title="No data yet"
            description="Start tracking habits to see your analytics."
            action={
              <Link href="/habits" className="text-primary text-sm font-medium hover:underline">
                Create a habit
              </Link>
            }
          />
        </div>
      </AppShell>
    );
  }

  const stats = [
    {
      icon: Flame,
      value: completionRate,
      suffix: "%",
      label: "Completion (30d)",
      bg: "bg-primary-subtle",
      color: "text-primary",
    },
    {
      icon: CheckCircle,
      value: totalCompleted,
      label: "Habits completed",
      bg: "bg-success-light",
      color: "text-success",
    },
    {
      icon: TrendingUp,
      value: habits.length,
      label: "Active habits",
      bg: "bg-accent-light",
      color: "text-accent",
    },
    {
      icon: Calendar,
      value: 30,
      label: "Days tracked",
      bg: "bg-warning-light",
      color: "text-warning",
    },
  ];

  return (
    <AppShell>
      <div className="p-6 lg:p-8 max-w-3xl mx-auto">
        <PageTransition>
          <h1 className="text-title text-foreground mb-6">Analytics</h1>

          {/* Stat Cards */}
          <motion.div
            className="grid grid-cols-2 gap-4 mb-8"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {stats.map((stat) => (
              <motion.div key={stat.label} variants={staggerItem}>
                <Card hover>
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-[11px] ${stat.bg} flex items-center justify-center`}>
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        <AnimatedCounter value={stat.value} />
                        {stat.suffix || ""}
                      </p>
                      <p className="text-[13px] text-text-muted">{stat.label}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Dimension Scores */}
          <h2 className="text-label text-text-secondary mb-3">Wellness Dimensions</h2>
          <div className="grid gap-4 mb-8">
            <DimensionBar dimension="body" score={dimensionScores.body} />
            <DimensionBar dimension="mind" score={dimensionScores.mind} />
            <DimensionBar dimension="lifestyle" score={dimensionScores.lifestyle} />
          </div>

          {/* Insight Placeholder */}
          <h2 className="text-label text-text-secondary mb-3">Insights</h2>
          <Card gradientBorder>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-[10px] bg-primary-subtle flex items-center justify-center flex-shrink-0">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-1">Keep going!</p>
                <p className="text-sm text-text-secondary">
                  Keep tracking for a week to unlock personalized insights about your habits and patterns.
                </p>
              </div>
            </div>
          </Card>
        </PageTransition>
      </div>
    </AppShell>
  );
}

export default function AnalyticsPage() {
  return (
    <AuthGuard>
      <AnalyticsContent />
    </AuthGuard>
  );
}
