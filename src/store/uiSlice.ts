// uiSlice — настройки интерфейса (то что относится к «как сейчас выглядит экран»):

// какая привычка выбрана сейчас
// какой месяц открыт в календаре
// какие фильтры включены

import { immer } from "zustand/middleware/immer";
import { create } from "zustand";
import type { UiSlice, DateNow, SortBy, FilterBy} from "../types";


export const useUiSlice = create(
    immer<UiSlice>((set) => ({
        habitNow: '',

        dateNow: {
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
        },

        filter: {
            onlyDueToday: false,
            hideCompletedToday: false,
            sortBy: 'name'
        },

        toggleHabit: (habitId: string) => set((state) => {
            if(habitId === '') return state.habitNow = ''; // при повторном клике снимаем привычку
            if (habitId === state.habitNow) return;
            state.habitNow = habitId 
        }),
        toggleDate: (date: DateNow) => set((state) => {
            state.dateNow = date
        }),
        toggleFilter: (filterName: FilterBy) => set((state) => {
            state.filter[filterName] = !state.filter[filterName]
        }),
        toggleSort: (sort: SortBy) => set((state) => {
            state.filter.sortBy = sort
        }),
    })),
)

// deleteHabit: (habitId: string) => set((state) => {
//             state.habits = state.habits.filter(habit => habit.id !== habitId);
//             delete state.completions[habitId]
//         }),