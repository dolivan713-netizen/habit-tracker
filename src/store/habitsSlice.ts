import { immer } from "zustand/middleware/immer";
import { create } from "zustand";
import { persist } from 'zustand/middleware'
import type { HabitsSlice, Habit } from "../types";

export const useHabitSlice = create(
    persist(
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

                state.habits.push(habit);
                state.completions[habit.id] = {};
            }),

            deleteHabit: (habitId: string) => set((state) => {
                state.habits = state.habits.filter((habit: Habit) => habit.id !== habitId);
                delete state.completions[habitId];
            }),

            
            doneDay: (habitId: string, date: string) => set((state) => {
                const completions = state.completions[habitId]

                if(!completions) return;

                state.completions[habitId][date] = true;
            }),

            cancelDoneHabit: (habitId: string, date: string) => set((state) => {
                delete state.completions[habitId][date];
            })
        })),

        {name: 'habit-Slice'}
    )
)



    