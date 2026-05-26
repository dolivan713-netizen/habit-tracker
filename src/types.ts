import type { Day } from "date-fns";

export type HabitCompletions = Record<string, true>;
export type Completions = Record<string, HabitCompletions> // храним только успешные дни 

export type SortBy = 'streak' | 'name' | 'createdAt'
export type FilterBy = 'onlyDueToday' | 'hideCompletedToday';

export type DateNow = { 
    year: number,
    month: number // 1 - 12
}

export type Habit = {
    id: string
    name: string
    color: string
    createdAt: string // ISO 
    frequency: Day[]
}

export type NewHabit = {
    name: string
    color: string
    frequency: Day[]
}

export type Filters = {
    onlyDueToday: boolean
    hideCompletedToday: boolean
    sortBy: SortBy
}

export type HabitsSlice = {
    habits: Habit[]
    completions: Completions
    addHabit: (newHabit: NewHabit) => void
    deleteHabit: (habitId: string) => void
    doneDay: (habitId: string, date: string) => void // здесь не уверен в типе но принимать будет completions['habit']["2026-05-13"]
    cancelDoneHabit: (habitId: string, date: string) => void
}

export type UiSlice = {
    habitNow: string
    dateNow: DateNow
    filter: Filters
    toggleHabit: (habit: string) => void
    toggleDate: (date: DateNow) => void
    toggleFilter: (filter: FilterBy) => void
    toggleSort: (sort: SortBy) => void
}
