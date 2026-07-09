export type Dimension = "body" | "mind" | "lifestyle";
export type FrequencyType = "daily" | "times_per_week" | "specific_days";
export type TimeOfDay = "morning" | "afternoon" | "evening" | "anytime";
export type Difficulty = "easy" | "medium" | "hard";
export type LogStatus = "completed" | "skipped";
export type Theme = "light" | "dark" | "system";

export interface UserPreferences {
  theme: Theme;
  focus_areas: Dimension[];
  time_preference: TimeOfDay;
}

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  dimension: Dimension;
  frequency_type: FrequencyType;
  frequency_value: number | null;
  frequency_days: number[] | null;
  target_time: TimeOfDay;
  difficulty: Difficulty;
  notes: string | null;
  is_quantitative: boolean;
  quantitative_unit: string | null;
  quantitative_target: number | null;
  is_archived: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Routine {
  id: string;
  user_id: string;
  name: string;
  time_of_day: TimeOfDay;
  sort_order: number;
  created_at: string;
  habits?: RoutineHabit[];
}

export interface RoutineHabit {
  id: string;
  routine_id: string;
  habit_id: string;
  sort_order: number;
  habit?: Habit;
}

export interface HabitLog {
  id: string;
  user_id: string;
  habit_id: string;
  log_date: string;
  status: LogStatus;
  value: number | null;
  notes: string | null;
  created_at: string;
}

export interface MoodLog {
  id: string;
  user_id: string;
  log_date: string;
  mood: number;
  energy: number | null;
  notes: string | null;
  created_at: string;
}

export interface SleepLog {
  id: string;
  user_id: string;
  log_date: string;
  hours: number | null;
  quality: number | null;
  notes: string | null;
  created_at: string;
}

export interface Badge {
  id: string;
  user_id: string;
  badge_type: string;
  badge_name: string;
  description: string | null;
  unlocked_at: string;
}

export interface Insight {
  type: string;
  text: string;
  tone: "celebrate" | "positive" | "encourage" | "gentle" | "insight" | "motivate";
}

export interface WeeklySummary {
  period: { start: string; end: string };
  completionRate: number;
  totalCompleted: number;
  totalExpected: number;
  dimensionScores: Record<Dimension, number>;
  bestDay: string;
  worstDay: string;
  insights: Insight[];
  habitBreakdown: Array<{
    habit: string;
    dimension: Dimension;
    completionRate: number;
    currentStreak: number;
  }>;
}

export interface HeatmapData {
  date: string;
  count: number;
  intensity: number;
}

export interface User {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  onboarding_completed: boolean;
  preferences: UserPreferences;
  created_at: string;
  updated_at: string;
}
