"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/providers/ToastProvider";
import { useUIStore } from "@/stores/ui-store";
import { AppShell } from "@/components/layout/AppShell";
import { Providers } from "@/providers";
import { HabitCard } from "@/components/habits/HabitCard";
import { HabitForm } from "@/components/habits/HabitForm";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Plus } from "lucide-react";
import { type Habit, type HabitLog, type Dimension } from "@/types";
import { format } from "date-fns";

function HabitsContent() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const supabase = createClient();
  const { openHabitModal } = useUIStore();
  const today = format(new Date(), "yyyy-MM-dd");
  const [filter, setFilter] = useState<Dimension | "all">("all");

  const { data: habits = [], isLoading } = useQuery({
    queryKey: ["habits"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("habits")
        .select("*")
        .eq("user_id", user!.id)
        .order("sort_order");
      if (error) throw error;
      return data as Habit[];
    },
    enabled: !!user,
  });

  const { data: logs = [] } = useQuery({
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

  const archiveMutation = useMutation({
    mutationFn: async (habitId: string) => {
      const { error } = await supabase
        .from("habits")
        .update({ is_archived: true })
        .eq("id", habitId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      showToast("Habit archived", "default", {
        label: "Undo",
        onClick: () => {
          // TODO: implement undo
        },
      });
    },
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
  });

  const activeHabits = habits.filter((h) => !h.is_archived);
  const archivedHabits = habits.filter((h) => h.is_archived);
  const filteredHabits = filter === "all" ? activeHabits : activeHabits.filter((h) => h.dimension === filter);

  if (isLoading) {
    return (
      <AppShell>
        <div className="p-6 max-w-3xl mx-auto space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
          </div>
          <div className="space-y-3">
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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-foreground">Habits</h1>
          <Button onClick={() => openHabitModal()} size="sm">
            <Plus className="w-4 h-4 mr-1" />
            New Habit
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <Chip label="All" selected={filter === "all"} onClick={() => setFilter("all")} />
          <Chip label="Body" selected={filter === "body"} onClick={() => setFilter("body")} color="var(--body-color)" />
          <Chip label="Mind" selected={filter === "mind"} onClick={() => setFilter("mind")} color="var(--mind-color)" />
          <Chip label="Lifestyle" selected={filter === "lifestyle"} onClick={() => setFilter("lifestyle")} color="var(--lifestyle-color)" />
        </div>

        {/* Active Habits */}
        {activeHabits.length === 0 ? (
          <EmptyState
            title="No habits yet"
            description="Create your first habit and start building your wellness routine."
            action={
              <Button onClick={() => openHabitModal()}>
                <Plus className="w-4 h-4 mr-1" />
                Create First Habit
              </Button>
            }
          />
        ) : (
          <>
            <SectionHeader title={`Active Habits (${filteredHabits.length})`} />
            <div className="space-y-3 mb-8">
              {filteredHabits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  isCompleted={logs.some(
                    (l) => l.habit_id === habit.id && l.status === "completed"
                  )}
                  onToggle={() =>
                    toggleMutation.mutate({
                      habitId: habit.id,
                      currentlyCompleted: logs.some(
                        (l) => l.habit_id === habit.id && l.status === "completed"
                      ),
                    })
                  }
                />
              ))}
            </div>
          </>
        )}

        {/* Archived */}
        {archivedHabits.length > 0 && (
          <>
            <SectionHeader title={`Archived (${archivedHabits.length})`} />
            <div className="space-y-3 opacity-60">
              {archivedHabits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  isCompleted={false}
                  onToggle={() => {}}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <HabitForm />
    </AppShell>
  );
}

export default function HabitsPage() {
  return (
    <Providers>
      <AuthGuard>
        <HabitsContent />
      </AuthGuard>
    </Providers>
  );
}
