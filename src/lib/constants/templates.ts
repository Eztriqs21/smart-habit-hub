import { type Dimension, type FrequencyType, type TimeOfDay, type Difficulty } from "@/types";

export interface TemplateHabit {
  name: string;
  dimension: Dimension;
  frequency_type: FrequencyType;
  frequency_value?: number;
  frequency_days?: number[];
  target_time: TimeOfDay;
  difficulty: Difficulty;
  is_quantitative?: boolean;
  quantitative_unit?: string;
  quantitative_target?: number;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  habits: TemplateHabit[];
}

export const TEMPLATES: Template[] = [
  {
    id: "productive-student",
    name: "Productive Student",
    description: "Build focus, learning, and wellness habits for academic success.",
    habits: [
      { name: "Morning study session", dimension: "mind", frequency_type: "daily", target_time: "morning", difficulty: "medium" },
      { name: "Read for 30 minutes", dimension: "mind", frequency_type: "daily", target_time: "evening", difficulty: "easy", is_quantitative: true, quantitative_unit: "minutes", quantitative_target: 30 },
      { name: "Exercise", dimension: "body", frequency_type: "times_per_week", frequency_value: 3, target_time: "afternoon", difficulty: "medium" },
      { name: "Drink 2L water", dimension: "body", frequency_type: "daily", target_time: "anytime", difficulty: "easy", is_quantitative: true, quantitative_unit: "liters", quantitative_target: 2 },
      { name: "Sleep by 11 PM", dimension: "lifestyle", frequency_type: "daily", target_time: "evening", difficulty: "hard" },
      { name: "Journal 5 minutes", dimension: "mind", frequency_type: "daily", target_time: "evening", difficulty: "easy", is_quantitative: true, quantitative_unit: "minutes", quantitative_target: 5 },
    ],
  },
  {
    id: "fitness-starter",
    name: "Fitness Starter",
    description: "Start your fitness journey with balanced body and recovery habits.",
    habits: [
      { name: "Morning workout", dimension: "body", frequency_type: "times_per_week", frequency_value: 4, target_time: "morning", difficulty: "medium" },
      { name: "Stretch for 10 minutes", dimension: "body", frequency_type: "daily", target_time: "morning", difficulty: "easy", is_quantitative: true, quantitative_unit: "minutes", quantitative_target: 10 },
      { name: "Drink 3L water", dimension: "body", frequency_type: "daily", target_time: "anytime", difficulty: "medium", is_quantitative: true, quantitative_unit: "liters", quantitative_target: 3 },
      { name: "Eat a healthy breakfast", dimension: "body", frequency_type: "daily", target_time: "morning", difficulty: "easy" },
      { name: "10,000 steps", dimension: "body", frequency_type: "daily", target_time: "anytime", difficulty: "medium", is_quantitative: true, quantitative_unit: "steps", quantitative_target: 10000 },
      { name: "8 hours of sleep", dimension: "lifestyle", frequency_type: "daily", target_time: "evening", difficulty: "medium", is_quantitative: true, quantitative_unit: "hours", quantitative_target: 8 },
    ],
  },
  {
    id: "calm-mind",
    name: "Calm Mind",
    description: "Nurture mental wellness with mindfulness and self-care habits.",
    habits: [
      { name: "Meditate 10 minutes", dimension: "mind", frequency_type: "daily", target_time: "morning", difficulty: "easy", is_quantitative: true, quantitative_unit: "minutes", quantitative_target: 10 },
      { name: "Gratitude journal", dimension: "mind", frequency_type: "daily", target_time: "evening", difficulty: "easy" },
      { name: "Read for 20 minutes", dimension: "mind", frequency_type: "daily", target_time: "evening", difficulty: "easy", is_quantitative: true, quantitative_unit: "minutes", quantitative_target: 20 },
      { name: "No phone first hour", dimension: "lifestyle", frequency_type: "daily", target_time: "morning", difficulty: "medium" },
      { name: "Walk in nature", dimension: "body", frequency_type: "times_per_week", frequency_value: 3, target_time: "afternoon", difficulty: "easy" },
      { name: "Deep breathing exercises", dimension: "mind", frequency_type: "daily", target_time: "anytime", difficulty: "easy" },
    ],
  },
];
