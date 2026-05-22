// habitsSlice — реальные данные (то что важно сохранить навсегда):

import { immer } from "zustand/middleware/immer";
import { create } from "zustand";
import type { HabitsSlice } from "../types";

const useHabitSlice = create(
    immer<HabitsSlice>((set) => ({
        habits: [], 
        completions: {},
        addHabit: (newHabit) => set((state) => {
            const today = new Date().toISOString().split('T')[0];

            const habit = {
                id: crypto.randomUUID(),
                name: newHabit.name,
                color: newHabit.color,
                createdAt: today,
                frequency: newHabit.frequency,
            }
            state.habits.push(habit)
            //state.completions[habit.id] = { [today]: false} так как поменял в completions теперь только выполненые дни 
        }),
        deleteHabit: (habitId: string) => set((state) => {
            state.habits = state.habits.filter(habit => habit.id !== habitId);
            delete state.completions[habitId]
        }),
        // теперь нужно написать отдельно функцию для отметки что выполнил. также нужно написать функуию для отмены
        // если привычку отметили как выполнено и решили отменить
        toggleDay: (habitId: string, date: string) => set((state) => {
            const completions = state.completions[habitId]
            if(!completions) return;
            completions[date] = !completions[date]
        }),
    }))
)

// completions = {
//   "habit-1": { "2026-05-13": true, "2026-05-12": false },
//   "habit-2": { "2



    