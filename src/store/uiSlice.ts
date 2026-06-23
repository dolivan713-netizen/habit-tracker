// uiSlice — настройки интерфейса (то что относится к «как сейчас выглядит экран»):

// какая привычка выбрана сейчас
// какой месяц открыт в календаре
// какие фильтры включены

import { immer } from "zustand/middleware/immer";
import { create } from "zustand";
import type { UiSlice, SortBy, FilterBy} from "../types";


export const useUiSlice = create(
    immer<UiSlice>((set) => ({
        habitNow: '',

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
    
        toggleFilter: (filterName: FilterBy) => set((state) => {
            state.filter[filterName] = !state.filter[filterName]
        }),
        toggleSort: (sort: SortBy) => set((state) => {
            state.filter.sortBy = sort
        }),
    })),
)