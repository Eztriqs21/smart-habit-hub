import { type Dimension } from "@/types";

export const DIMENSIONS: Record<Dimension, { label: string; color: string; lightColor: string; icon: string }> = {
  body: {
    label: "Body",
    color: "var(--body-color)",
    lightColor: "var(--body-light)",
    icon: "dumbbell",
  },
  mind: {
    label: "Mind",
    color: "var(--mind-color)",
    lightColor: "var(--mind-light)",
    icon: "brain",
  },
  lifestyle: {
    label: "Lifestyle",
    color: "var(--lifestyle-color)",
    lightColor: "var(--lifestyle-light)",
    icon: "leaf",
  },
};

export const FREQUENCY_LABELS = {
  daily: "Daily",
  times_per_week: "Times per week",
  specific_days: "Specific days",
};

export const TIME_LABELS = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  anytime: "Anytime",
};

export const DIFFICULTY_LABELS = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const MOTIVATIONAL_QUOTES = [
  "Small steps every day lead to big changes.",
  "Consistency is the key to transformation.",
  "You're building something great, one habit at a time.",
  "Progress, not perfection.",
  "Every check-off is a win.",
  "Your future self will thank you.",
  "The best time to start was yesterday. The next best time is now.",
  "Discipline is choosing between what you want now and what you want most.",
  "You don't have to be extreme, just consistent.",
  "A year from now, you'll wish you had started today.",
];
