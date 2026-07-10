import type { Day } from "date-fns";
import type { ImportHabits } from "./lib/io";

export type HabitCompleted = Record<string, true>;

export type Completed = Record<string, HabitCompleted>;

export type SortBy = 'streak' | 'name' | 'createdAt';

export type FilterBy = 'onlyDueToday' | 'hideCompletedToday';

export type ImportData = {habits: ImportHabits, completed: Completed}

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
    completed: Completed
    addHabit: (newHabit: NewHabit) => void
    editHabit: (habitId: string, reName: string) => void
    deleteHabit: (habitId: string) => void
    importHabits: (importData: ImportData) => void
    doneDay: (habitId: string, date: string) => void
    cancelDoneHabit: (habitId: string, date: string) => void
}

export type UiSlice = {
    filter: Filters
    toggleFilter: (filter: FilterBy) => void
    toggleSort: (sort: SortBy) => void
}

export type PropsDayCell = {
    date: Date
    state: PropState
    click?: () => void
}

export type PropState = "disabled" | "completed" | "active" | "failed";