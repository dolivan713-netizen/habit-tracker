// habitsSlice — реальные данные (то что важно сохранить навсегда):

import { immer } from "zustand/middleware/immer";
import { create } from "zustand";
import { persist } from 'zustand/middleware'
import type { HabitsSlice } from "../types";

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
                    createdAt: today, // понять какой формат хранить ISO возможно
                    frequency: newHabit.frequency,
                }
                state.habits.push(habit) 
                state.completions[habit.id] = {} //при первом дабавлении
            }),
            deleteHabit: (habitId: string) => set((state) => {
                state.habits = state.habits.filter(habit => habit.id !== habitId);
                delete state.completions[habitId]
            }),
            // теперь нужно написать отдельно функцию для отметки что выполнил. также нужно написать функуию для отмены
            // если привычку отметили как выполнено и решили отменить
            doneDay: (habitId: string, date: string) => set((state) => { // нет проверки, что date соответствует schedule
                const completions = state.completions[habitId]
                if(!completions) return;
                //state.completions[habitId] = {[date]: true, ...completions} //переделал тут
                state.completions[habitId][date] = true;
            }),
            cancelDoneHabit: (habitId: string, date: string) => set((state) => { //отмена выполнения дня
                // const completions = state.completions[habitId];
                // if(!completions) return;
                delete state.completions[habitId][date];
            })
        })),
        
        {name: 'habit-Slice'}
    )
)

// completions = {
//   "habit-1": { "2026-05-13": true, "2026-05-12": false },
//   "habit-2": { "2



    