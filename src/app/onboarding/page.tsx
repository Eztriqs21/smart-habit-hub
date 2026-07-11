"use client";

import { useMutation } from "@tanstack/react-query";
import { createClient, BASE_PATH } from "@/lib/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { TEMPLATES } from "@/lib/constants/templates";
import { DIMENSIONS } from "@/lib/constants/dimensions";
import { type Dimension, type TimeOfDay } from "@/types";
import { ArrowRight, ArrowLeft, CheckCircle, Dumbbell, Brain, Leaf, Sparkles } from "lucide-react";

const STEPS = ["Welcome", "Focus Areas", "Time Preference", "Template"];

function OnboardingContent() {
  const { user } = useAuth();
  const supabase = createClient();
  const {
    currentStep,
    displayName,
    focusAreas,
    timePreference,
    templateId,
    setStep,
    setDisplayName,
    toggleFocusArea,
    setTimePreference,
    setTemplateId,
    complete,
  } = useOnboardingStore();

  const applyMutation = useMutation({
    mutationFn: async () => {
      if (!user) return;

      // Update user preferences
      await supabase
        .from("users")
        .update({
          display_name: displayName || null,
          onboarding_completed: true,
          preferences: {
            theme: "system",
            focus_areas: focusAreas.length > 0 ? focusAreas : ["body", "mind", "lifestyle"],
            time_preference: timePreference,
          },
        })
        .eq("id", user.id);

      // Apply template if selected
      if (templateId) {
        const template = TEMPLATES.find((t) => t.id === templateId);
        if (template) {
          const habits = template.habits.map((h) => ({
            user_id: user.id,
            name: h.name,
            dimension: h.dimension,
            frequency_type: h.frequency_type,
            frequency_value: h.frequency_value || null,
            frequency_days: h.frequency_days || null,
            target_time: timePreference,
            difficulty: h.difficulty,
            notes: null,
            is_quantitative: h.is_quantitative || false,
            quantitative_unit: h.quantitative_unit || null,
            quantitative_target: h.quantitative_target || null,
            is_archived: false,
            sort_order: 0,
          }));

          const { data: createdHabits } = await supabase
            .from("habits")
            .insert(habits)
            .select("id");

          if (createdHabits && createdHabits.length > 0) {
            await supabase.from("routines").insert({
              user_id: user.id,
              name: template.name,
              time_of_day: timePreference,
              sort_order: 0,
            });
          }
        }
      }
    },
    onSuccess: () => {
      complete();
      window.location.href = `${BASE_PATH}/today`;
    },
  });

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return true; // Name is optional
      case 2:
        return true; // Focus areas are optional (defaults to all)
      case 3:
        return true; // Time preference has a default
      case 4:
        return true; // Template is optional
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setStep(currentStep + 1);
    } else {
      applyMutation.mutate();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-[520px]">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((step, i) => (
            <div key={step} className="flex items-center gap-2 flex-1">
              <div
                className={`w-full h-1.5 rounded-full transition-colors ${
                  i <= currentStep ? "bg-primary" : "bg-border"
                }`}
              />
            </div>
          ))}
        </div>

        {/* Step 0: Welcome */}
        {currentStep === 0 && (
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary-subtle flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-3">
              Welcome to <span className="text-primary">WellnessHub</span>
            </h1>
            <p className="text-text-secondary mb-2">
              Let&apos;s set up your habits in just a few steps.
            </p>
            <div className="mt-6">
              <Input
                label="Your name (optional)"
                placeholder="What should we call you?"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Step 1: Focus Areas */}
        {currentStep === 1 && (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-3">
              What areas matter to you?
            </h1>
            <p className="text-text-secondary mb-8">
              Select all that apply. You can always change this later.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {([
                { dim: "body" as Dimension, icon: Dumbbell, label: "Body", desc: "Fitness, nutrition, sleep" },
                { dim: "mind" as Dimension, icon: Brain, label: "Mind", desc: "Learning, focus, mindfulness" },
                { dim: "lifestyle" as Dimension, icon: Leaf, label: "Lifestyle", desc: "Routines, balance, habits" },
              ] as const).map((item) => (
                <button
                  key={item.dim}
                  onClick={() => toggleFocusArea(item.dim)}
                  className={`flex flex-col items-center p-5 rounded-[16px] border-2 transition-all ${
                    focusAreas.includes(item.dim)
                      ? "border-primary bg-primary-subtle"
                      : "border-border bg-surface hover:border-text-muted"
                  }`}
                >
                  <item.icon
                    className="w-8 h-8 mb-3"
                    style={{ color: focusAreas.includes(item.dim) ? DIMENSIONS[item.dim].color : "var(--text-muted)" }}
                  />
                  <p className="font-semibold text-foreground text-sm">{item.label}</p>
                  <p className="text-[12px] text-text-muted mt-1">{item.desc}</p>
                  {focusAreas.includes(item.dim) && (
                    <CheckCircle className="w-5 h-5 text-primary mt-3" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Time Preference */}
        {currentStep === 2 && (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-3">
              When do you prefer your main routine?
            </h1>
            <p className="text-text-secondary mb-8">
              This helps us organize your habits.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {([
                { value: "morning" as TimeOfDay, label: "Morning", emoji: "☀️", desc: "Start strong" },
                { value: "afternoon" as TimeOfDay, label: "Afternoon", emoji: "🌤️", desc: "Mid-day push" },
                { value: "evening" as TimeOfDay, label: "Evening", emoji: "🌙", desc: "Wind down" },
              ] as const).map((item) => (
                <button
                  key={item.value}
                  onClick={() => setTimePreference(item.value)}
                  className={`flex flex-col items-center p-5 rounded-[16px] border-2 transition-all ${
                    timePreference === item.value
                      ? "border-primary bg-primary-subtle"
                      : "border-border bg-surface hover:border-text-muted"
                  }`}
                >
                  <span className="text-3xl mb-3">{item.emoji}</span>
                  <p className="font-semibold text-foreground text-sm">{item.label}</p>
                  <p className="text-[12px] text-text-muted mt-1">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Template */}
        {currentStep === 3 && (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-3">
              Start with a template?
            </h1>
            <p className="text-text-secondary mb-8">
              Choose a pre-built set of habits or start from scratch.
            </p>
            <div className="grid grid-cols-2 gap-3 text-left">
              {TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setTemplateId(template.id)}
                  className={`p-4 rounded-[10px] border-2 transition-all ${
                    templateId === template.id
                      ? "border-primary bg-primary-subtle"
                      : "border-border bg-surface hover:border-text-muted"
                  }`}
                >
                  <p className="font-semibold text-foreground text-sm">{template.name}</p>
                  <p className="text-[12px] text-text-muted mt-1 line-clamp-2">{template.description}</p>
                  <p className="text-[12px] text-primary mt-2 font-medium">
                    {template.habits.length} habits
                  </p>
                </button>
              ))}
              <button
                onClick={() => setTemplateId(null)}
                className={`p-4 rounded-[10px] border-2 transition-all ${
                  templateId === null
                    ? "border-primary bg-primary-subtle"
                    : "border-border bg-surface hover:border-text-muted"
                }`}
              >
                <p className="font-semibold text-foreground text-sm">Start from Scratch</p>
                <p className="text-[12px] text-text-muted mt-1">Build your own routine</p>
              </button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10">
          {currentStep > 0 ? (
            <Button variant="ghost" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          ) : (
            <div />
          )}
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            isLoading={applyMutation.isPending}
          >
            {currentStep === 3 ? "Finish" : "Continue"}
            {currentStep < 3 && <ArrowRight className="w-4 h-4 ml-1" />}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <AuthGuard>
      <OnboardingContent />
    </AuthGuard>
  );
}
