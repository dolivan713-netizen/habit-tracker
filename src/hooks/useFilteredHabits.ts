import type { Completions, Filters, Habit } from "../types"
import { useMemo } from "react"
import { format} from "date-fns";
import { dates } from "../lib/dates";

type Props = {
    completed: Completions
    habits: Habit[]
    filters: Filters
    today: Date
}

export default function useFilteredHabits({completed, habits, filters, today}: Props) {

    const {onlyDueToday, hideCompletedToday, sortBy} = filters;
    const streak = dates.calculateStreak

    const filtred = useMemo(() => {
        const strToday = format(today, 'yyyy-MM-dd');
        let filtredHabit = structuredClone(habits);
    
        if (hideCompletedToday) { // "Скрыть выполненные сегодня" 
            // filtredComplit = Object.fromEntries(
            //     Object.entries(filtredComplit).filter(([habits, complit]) => complit[strToday] === undefined)
            // )
            filtredHabit = filtredHabit.filter(habit => completed[habit.id][strToday] === undefined);
        }

        if (onlyDueToday) { // "Только активные сегодня" если сегодня ничего не нужно то ничего не возвращаем
            // нужна проверка на дату создания
            filtredHabit = filtredHabit.filter(habit => (habit.frequency as readonly number[]).includes(today.getDay()));
        }

        return filtredHabit

    }, [completed, habits, today, onlyDueToday, hideCompletedToday])
    

    const sorted = useMemo(() => {
        const sortedHabit = structuredClone(filtred);

        switch (sortBy) {
            case "streak": // проверить потом через ии
                sortedHabit.sort((a, b) => 
                    streak(completed[b.id], b.frequency, today) - streak(completed[a.id], a.frequency, today)
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




// completions = {
//   "habit-1": { "2026-05-13": true, "2026-05-12": false },
//   "habit-2": { "2





// ### 📐 Часть 1. Кастомный хук `useFilteredHabits`

// Этот хук не принимает аргументов, а сам лезет в Zustand сторы, забирает сырые данные и возвращает чистый отсортированный массив. // разве не лучше сделать хук тупым и передавать в него данные??

// #### Архитектурная структура (Псевдокод):

// ```typescript
// export function useFilteredHabits() {
//   // 1. Достаем данные из useHabitSlice (habits, completions)
//   // 2. Достаем данные из useUiSlice (filter: { onlyDueToday, hideCompletedToday, sortBy })

//   return useMemo(() => {
//     let result = [...habits];
//     const today = new Date();
//     const todayStr = format(today, 'yyyy-MM-dd');
//     const todayDayOfWeek = today.getDay(); // 0-6

//     // ЭТАП 1: Фильтрация "Только активные сегодня"
//     if (onlyDueToday) {
//       result = result.filter(habit => {
//         // Проверяем два условия:
//         // А) Привычка уже должна быть создана (createdAt <= today) // почему нельзя просто сделать через include??
//         // Б) Её frequency включает сегодняшний день недели
//       });
//     }

//     // ЭТАП 2: Фильтрация "Скрыть выполненные сегодня"
//     if (hideCompletedToday) {
//       result = result.filter(habit => {
//         // Проверяем, есть ли запись completions[habit.id]?.[todayStr]
//         // Если есть — возвращаем false (удаляем из списка)
//       });
//     }

//     // ЭТАП 3: Сортировка (sortBy)
//     result.sort((a, b) => {
//       if (sortBy === 'name') {
//         return a.name.localeCompare(b.name);
//       }
//       if (sortBy === 'createdAt') {
//         return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
//       }
//       if (sortBy === 'streak') {
//         // Вызываем оффлайн-функцию расчета стрикa
//         return calculateStreak(b.id, completions) - calculateStreak(a.id, completions);
//       }
//       return 0;
//     });

//     return result;
//   }, [habits, completions, onlyDueToday, hideCompletedToday, sortBy]);
// }

