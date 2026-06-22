import type { Completions, Filters, Habit } from "../types"
import { useMemo } from "react"
import { parseISO } from "date-fns";
import { dates } from "../lib/dates";

type Props = {
    completed: Completions
    habits: Habit[]
    filters: Filters
    today: string
}

export default function useFilteredHabits({completed, habits, filters, today}: Props) {
    const {onlyDueToday, hideCompletedToday, sortBy} = filters;
    const streak = dates.calculateStreak;
    
    const filtred = useMemo(() => {
        const todayIso = parseISO(today);
        let filtredHabit = [...habits];
    
        if (hideCompletedToday) { // "Скрыть выполненные сегодня" 
            filtredHabit = filtredHabit.filter(habit => completed[habit.id]?.[today] === undefined);
        }

        if (onlyDueToday) { // "Только активные сегодня" 
            filtredHabit = filtredHabit.filter(habit => dates.isScheduledOn(habit.frequency, todayIso));
        }

        return filtredHabit

    }, [completed, habits, today, onlyDueToday, hideCompletedToday])
    

    const sorted = useMemo(() => {
        const sortedHabit = [...filtred];

        switch (sortBy) {
            case "streak":
                sortedHabit.sort((a, b) => 
                    streak(completed[b.id] ?? {}, b.frequency, today) - streak(completed[a.id] ?? {}, a.frequency, today)
            )
                break;
            case "name":
                sortedHabit.sort((a, b) => a.name.localeCompare(b.name))
                break;
            case "createdAt":
                sortedHabit.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                break;
        }

        return sortedHabit

    }, [completed, today, streak, filtred, sortBy])
    
    return sorted;
}