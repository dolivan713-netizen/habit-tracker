import { immer } from "zustand/middleware/immer";
import { create } from "zustand";
import { persist } from 'zustand/middleware'
import { format } from "date-fns";
import type { HabitsSlice, Habit, ImportData } from "../types";


export const useHabitSlice = create(
    persist(
        immer<HabitsSlice>((set) => ({
            habits: [],
            completed: {},

            addHabit: (newHabit) => set((state) => {
                const todayIso = format(new Date(), 'yyyy-MM-dd')
                const habit = {
                    id: crypto.randomUUID(),
                    name: newHabit.name,
                    color: newHabit.color,
                    createdAt: todayIso, 
                    frequency: newHabit.frequency,
                }

                state.habits.push(habit);
                state.completed[habit.id] = {};
            }),

            editHabit: (habitId: string, reName: string) => set((state) => {
                const habit = state.habits.find(habit => habit.id === habitId);
                if (habit) habit.name = reName;
            }),

            deleteHabit: (habitId: string) => set((state) => {
                state.habits = state.habits.filter((habit: Habit) => habit.id !== habitId);
                delete state.completed[habitId];
            }),

            importHabits: (importData: ImportData) => set((state) => {
                state.habits = importData.habits;
                state.completed = importData.completed;
            }),

            doneDay: (habitId: string, date: string) => set((state) => {
                const completed = state.completed[habitId];

                if(!completed) return;

                state.completed[habitId][date] = true;
            }),

            cancelDoneHabit: (habitId: string, date: string) => set((state) => {
                const completed = state.completed[habitId];

                if(!completed) return;

                delete state.completed[habitId][date];
            })
        })),

        {name: 'habit-Slice'}
    )
)
    