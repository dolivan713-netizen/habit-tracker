import { immer } from "zustand/middleware/immer";
import { create } from "zustand";
import type { UiSlice, SortBy, FilterBy} from "../types";


export const useUiSlice = create(
    immer<UiSlice>((set) => ({
        filter: {
            onlyDueToday: false,
            hideCompletedToday: false,
            sortBy: 'name'
        },
        
        toggleFilter: (filterName: FilterBy) => set((state) => {
            state.filter[filterName] = !state.filter[filterName]
        }),
        toggleSort: (sort: SortBy) => set((state) => {
            state.filter.sortBy = sort
        }),
    })),
)