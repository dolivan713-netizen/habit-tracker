//буду вручную импортировать в каждый компонент из самих сторов

// import { useHabitSlice } from "./habitsSlice";
// import { useUiSlice } from "./uiSlice";

// export const useStore = () => {
//     const habitNow = useUiSlice(state => state.habitNow);
//     const dateNow = useUiSlice(state => state.dateNow);
//     const filter = useUiSlice(state => state.filter);
//     const toggleHabit = useUiSlice(state => state.toggleHabit);
//     const toggleDate = useUiSlice(state => state.toggleDate);
//     const toggleFilter = useUiSlice(state => state.toggleFilter);
//     const toggleSort = useUiSlice(state => state.toggleSort);
//     const habits = useHabitSlice(state => state.habits);
//     const completions = useHabitSlice(state => state.completions);
//     const addHabit = useHabitSlice(state => state.addHabit);
//     const deleteHabit = useHabitSlice(state => state.deleteHabit);
//     const doneDay = useHabitSlice(state => state.doneDay);
//     const cancelDoneHabit = useHabitSlice(state => state.cancelDoneHabit);

//     return {
//         habitNow,
//         dateNow,
//         filter,
//         toggleHabit,
//         toggleDate,
//         toggleFilter,
//         toggleSort,
//         habits,
//         completions,
//         addHabit,
//         deleteHabit,
//         doneDay,
//         cancelDoneHabit
//     }
// }