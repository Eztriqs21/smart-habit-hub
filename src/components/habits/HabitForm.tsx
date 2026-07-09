"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/providers/ToastProvider";
import { useUIStore } from "@/stores/ui-store";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Toggle } from "@/components/ui/Toggle";
import { Chip } from "@/components/ui/Chip";
import { DIMENSIONS, FREQUENCY_LABELS, TIME_LABELS, DIFFICULTY_LABELS, DAY_NAMES } from "@/lib/constants/dimensions";
import { type Dimension, type FrequencyType, type TimeOfDay, type Difficulty, type Habit } from "@/types";

interface HabitFormProps {
  habit?: Habit | null;
}

export function HabitForm({ habit }: HabitFormProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { activeHabitModal, closeHabitModal, editingHabitId } = useUIStore();
  const queryClient = useQueryClient();
  const supabase = createClient();
  const isEditing = !!editingHabitId;

  const [name, setName] = useState(habit?.name || "");
  const [dimension, setDimension] = useState<Dimension>(habit?.dimension || "body");
  const [frequencyType, setFrequencyType] = useState<FrequencyType>(habit?.frequency_type || "daily");
  const [frequencyValue, setFrequencyValue] = useState(habit?.frequency_value || 3);
  const [frequencyDays, setFrequencyDays] = useState<number[]>(habit?.frequency_days || [1, 2, 3, 4, 5]);
  const [targetTime, setTargetTime] = useState<TimeOfDay>(habit?.target_time || "anytime");
  const [difficulty, setDifficulty] = useState<Difficulty>(habit?.difficulty || "medium");
  const [notes, setNotes] = useState(habit?.notes || "");
  const [isQuantitative, setIsQuantitative] = useState(habit?.is_quantitative || false);
  const [quantitativeUnit, setQuantitativeUnit] = useState(habit?.quantitative_unit || "");
  const [quantitativeTarget, setQuantitativeTarget] = useState(habit?.quantitative_target || 0);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (name.length > 100) newErrors.name = "Name must be 100 characters or less";
    if (frequencyType === "times_per_week" && (frequencyValue < 1 || frequencyValue > 7)) {
      newErrors.frequencyValue = "Must be between 1 and 7";
    }
    if (frequencyType === "specific_days" && frequencyDays.length === 0) {
      newErrors.frequencyDays = "Select at least one day";
    }
    if (isQuantitative && !quantitativeUnit.trim()) {
      newErrors.quantitativeUnit = "Unit is required";
    }
    if (isQuantitative && quantitativeTarget <= 0) {
      newErrors.quantitativeTarget = "Target must be greater than 0";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        user_id: user!.id,
        name: name.trim(),
        dimension,
        frequency_type: frequencyType,
        frequency_value: frequencyType === "times_per_week" ? frequencyValue : null,
        frequency_days: frequencyType === "specific_days" ? frequencyDays : null,
        target_time: targetTime,
        difficulty,
        notes: notes.trim() || null,
        is_quantitative: isQuantitative,
        quantitative_unit: isQuantitative ? quantitativeUnit.trim() : null,
        quantitative_target: isQuantitative ? quantitativeTarget : null,
      };

      if (isEditing) {
        const { error } = await supabase.from("habits").update(payload).eq("id", editingHabitId!);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("habits").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      showToast(isEditing ? "Habit updated" : "Habit created!", "success");
      closeHabitModal();
    },
    onError: () => {
      showToast("Something went wrong. Please try again.", "error");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      saveMutation.mutate();
    }
  };

  const toggleDay = (day: number) => {
    setFrequencyDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <Modal
      isOpen={activeHabitModal}
      onClose={closeHabitModal}
      title={isEditing ? "Edit Habit" : "New Habit"}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Habit Name"
          placeholder="e.g., Morning meditation"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />

        {/* Dimension */}
        <div>
          <label className="text-[14px] font-medium text-text-secondary mb-2 block">Dimension</label>
          <div className="flex gap-2">
            {(Object.keys(DIMENSIONS) as Dimension[]).map((dim) => (
              <Chip
                key={dim}
                label={DIMENSIONS[dim].label}
                selected={dimension === dim}
                onClick={() => setDimension(dim)}
                color={DIMENSIONS[dim].color}
              />
            ))}
          </div>
        </div>

        {/* Frequency */}
        <div>
          <label className="text-[14px] font-medium text-text-secondary mb-2 block">Frequency</label>
          <div className="flex gap-2 flex-wrap">
            {(Object.keys(FREQUENCY_LABELS) as FrequencyType[]).map((ft) => (
              <Chip
                key={ft}
                label={FREQUENCY_LABELS[ft]}
                selected={frequencyType === ft}
                onClick={() => setFrequencyType(ft)}
              />
            ))}
          </div>
          {frequencyType === "times_per_week" && (
            <div className="mt-2">
              <Input
                type="number"
                min={1}
                max={7}
                value={frequencyValue}
                onChange={(e) => setFrequencyValue(Number(e.target.value))}
                error={errors.frequencyValue}
                helperText="How many times per week?"
              />
            </div>
          )}
          {frequencyType === "specific_days" && (
            <div className="mt-2 flex gap-1.5 flex-wrap">
              {DAY_NAMES.map((day, i) => (
                <Chip
                  key={day}
                  label={day}
                  selected={frequencyDays.includes(i + 1)}
                  onClick={() => toggleDay(i + 1)}
                  size="sm"
                />
              ))}
              {errors.frequencyDays && (
                <p className="text-[13px] text-error w-full">{errors.frequencyDays}</p>
              )}
            </div>
          )}
        </div>

        {/* Time of day */}
        <div>
          <label className="text-[14px] font-medium text-text-secondary mb-2 block">Time of Day</label>
          <div className="flex gap-2 flex-wrap">
            {(Object.keys(TIME_LABELS) as TimeOfDay[]).map((td) => (
              <Chip
                key={td}
                label={TIME_LABELS[td]}
                selected={targetTime === td}
                onClick={() => setTargetTime(td)}
              />
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <label className="text-[14px] font-medium text-text-secondary mb-2 block">Difficulty</label>
          <div className="flex gap-2">
            {(Object.keys(DIFFICULTY_LABELS) as Difficulty[]).map((d) => (
              <Chip
                key={d}
                label={DIFFICULTY_LABELS[d]}
                selected={difficulty === d}
                onClick={() => setDifficulty(d)}
              />
            ))}
          </div>
        </div>

        {/* Quantitative */}
        <div>
          <Toggle
            checked={isQuantitative}
            onChange={setIsQuantitative}
            label="Track a specific value (e.g., pages, liters)"
          />
          {isQuantitative && (
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Input
                label="Unit"
                placeholder="e.g., pages"
                value={quantitativeUnit}
                onChange={(e) => setQuantitativeUnit(e.target.value)}
                error={errors.quantitativeUnit}
              />
              <Input
                label="Target"
                type="number"
                min={1}
                value={quantitativeTarget}
                onChange={(e) => setQuantitativeTarget(Number(e.target.value))}
                error={errors.quantitativeTarget}
              />
            </div>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="text-[14px] font-medium text-text-secondary mb-1 block">Notes (optional)</label>
          <textarea
            className="w-full px-3 py-2 rounded-[10px] border border-border bg-surface text-foreground text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 resize-none h-20"
            placeholder="Any additional notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button variant="ghost" onClick={closeHabitModal} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" isLoading={saveMutation.isPending} className="flex-1">
            {isEditing ? "Save Changes" : "Create Habit"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
