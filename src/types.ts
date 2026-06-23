import type { Day } from "date-fns";

export type HabitCompletions = Record<string, true>;

export type Completions = Record<string, HabitCompletions>;

export type SortBy = 'streak' | 'name' | 'createdAt';

export type FilterBy = 'onlyDueToday' | 'hideCompletedToday';

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
    editHabit: (habitId: string, reName: string) => void
    deleteHabit: (habitId: string) => void
    doneDay: (habitId: string, date: string) => void
    cancelDoneHabit: (habitId: string, date: string) => void
}

export type UiSlice = {
    habitNow: string
    filter: Filters
    toggleHabit: (habit: string) => void
    toggleFilter: (filter: FilterBy) => void
    toggleSort: (sort: SortBy) => void
}

export type PropsDayCell = {
    date: Date
    state: PropState
    click?: () => void
}

export type PropState = "disabled" | "completed" | "active" | "failed";