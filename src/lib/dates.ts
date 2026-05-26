// Создадим папку lib/ и положим туда обычные функции, не связанные с Zustand или React:

// ┌─────────────────────────────────────────────────────────────┐
// │  Habit Tracker (4)                        [Экспорт] [Импорт]│  ← title + кнопки
// ├─────────────────────────────────────────────────────────────┤
// │  Фильтры: [только активные сегодня] [скрыть выполненные]   │
// │  Сортировка: [по алфавиту] [по streak] [по дате создания]  │
// ├─────────────────────────────────────────────────────────────┤
// │  🔴 Бегать        streak: 5д    30д: 87%                    │
// │  [01][02][03][04][05][06][07]...[30]          [✏️] [🗑️]    │  ← 30 ячеек
// │                                                             │
// │  🔵 Читать        streak: 12д   30д: 93%                    │
// │  [01][02][03][04][05][06][07]...[30]          [✏️] [🗑️]    │
// │                                                             │
// │  🟢 Медитация     streak: 0д    30д: 40%                    │
// │  [01][02][03][04][05][06][07]...[30]          [✏️] [🗑️]    │
// ├─────────────────────────────────────────────────────────────┤
// │  [+ Добавить привычку]                                      │  ← форма
// │  Название: [        ]  Цвет: [🔴]                           │
// │  Период: [каждый день] [по будням] [пн][вт][ср][чт][пт]    │
// └─────────────────────────────────────────────────────────────┘


import { previousDay, max, isSameDay, parseISO, eachDayOfInterval, startOfMonth, endOfMonth} from 'date-fns';
import type { HabitCompletions } from "../types";
import type { Day } from 'date-fns';

//const today = new Date(); передаем today через пропс
const getPreviousScheduledDate = (date: Date, schedule: Day[]) => max(schedule.map((day: Day) => previousDay(date, day)));
const getInitialExpected = (today: Date, schedule: Day[]): Date => {
    const expected = (schedule as readonly number[]).includes(today.getDay()) 
        ? today
        : getPreviousScheduledDate(today, schedule)
        return expected
}

export const dates = {
    calculateBestStreak: (habitCompletions: HabitCompletions, schedule: Day [], today: Date): number => {
        let maxStreak = 0;
        let streak = 0;
        let expected = getInitialExpected(today, schedule)
        const dates = Object.keys(habitCompletions).sort((a, b) => b.localeCompare(a));
        dates.forEach(date => {
            const noteDate = parseISO(date); // из строки в формат даты
            if (isSameDay(parseISO(date), today)) { // поменял на today
                expected = getPreviousScheduledDate(noteDate, schedule);
                return;
            } // если сегодня ждем конца дня
            if (!isSameDay(noteDate, expected)) { // проверяем чтобы это были одинаковые даты 
                streak = 1;
                expected = getPreviousScheduledDate(noteDate, schedule); // так как мы пропустили streak надо начинать с текущей даты
            } else {
                streak++;
                expected = getPreviousScheduledDate(expected, schedule);
            }
            if(streak > maxStreak) maxStreak = streak;
        })
        return maxStreak;
    },

    calculateStreak: (habitCompletions: HabitCompletions, schedule: Day [], today: Date): number => {
        let expected = getInitialExpected(today, schedule)
        let streak = 0;
        const dates = Object.keys(habitCompletions) //сортировка на всякий случай
            .sort((a, b) => b.localeCompare(a));
        for (const date of dates) {
            const noteDate = parseISO(date);
            if (isSameDay(noteDate, today)) { // поменял на today
                expected = getPreviousScheduledDate(expected, schedule); // берем сначала date и проверяем чтобы не была равна expected = today
                continue; // если равно то пропускаем и меняем expected = getPreviousScheduledDate(expected, schedule);
            }
            //if (expected === today) continue // проверка на today пропускаем пока деню не закончился
            if (!isSameDay(noteDate, expected)) break; // с помощью parseISO из ISO в объект Date, isSameDay проверяет чтобы это были одинаковые даты 
            expected = getPreviousScheduledDate(expected, schedule); // заменяем текущую дату на следующую по хронологии
            streak++
        }
        return streak;
    },

    getDaysOfMonth: (date: Date): Date[] => {
        return eachDayOfInterval({ start: startOfMonth(date), end: endOfMonth(date) });
    },

    // calculateCompletionRate: (completions, habit, days) => {

    // },
    // isHabitDue(habit, date) → true/false (нужно ли делать привычку в этот день — для «по будням» в субботу вернёт false)
}



// calculateStreak: (completions: Completions, habit: string, lengthMounth: number, nowDay: number) => {
//         const today = new Date();
//         const formattedDate = format(today, 'yyyy-MM-dd');
//         Object.hasOwn(completions[habit], formattedDate); // true если есть такой день
//         let strike = 0;
//         Object.entries(completions[habit]).forEach(isDone => {

//             if(!isDone) return;
//             if(isDone) {
//                 daysOfMonth++
//                 if(daysOfMonth > lengthMounth) return;
//                 strike++
//             } else {
//                 strike = 0
//             }
//         })
//         return strike
//     },



// Object.entries(completions[habit]).forEach(([date, isDone]) => {
//             // берем первый день из цикла и сравниваем с firstDay
//             if (!isSameDay(parseISO(date), expected)) return strike; // если false то возвращаем strike = 0. нужно как-то остановить цикл
//             strike++ // первый день соответсвует, увеличиваем. теперь нужно перейти к следующей проверке

//         })