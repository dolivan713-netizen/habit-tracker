import { previousDay, max, isSameDay, parseISO, subDays, eachDayOfInterval, format} from 'date-fns';
import type { HabitCompleted } from "../types";
import type { Day } from 'date-fns';


const getPreviousScheduledDate = (date: Date, schedule: Day[]) => max(schedule.map((day: Day) => previousDay(date, day)));
const getInitialExpected = (today: Date, schedule: Day[]): Date => {
    const expected = dates.isScheduledOn(schedule, today) 
        ? today
        : getPreviousScheduledDate(today, schedule)
        return expected
}

export const dates = {
    isScheduledOn: (schedule: Day [], date: Date) => {
       return schedule.includes(date.getDay() as Day)
    },

    calculateBestStreak: (habitCompleted: HabitCompleted, schedule: Day [], today: string): number => {
        const todayIso = parseISO(today);
        let maxStreak = 0;
        let streak = 0;
        
        let expected = habitCompleted[today]
            ? getInitialExpected(todayIso, schedule) 
            : getPreviousScheduledDate(todayIso, schedule)

        const dates = Object.keys(habitCompleted).sort((a, b) => b.localeCompare(a));

        dates.forEach(date => {
            const noteDate = parseISO(date); // из строки в формат даты

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

    calculateStreak: (habitCompleted: HabitCompleted, schedule: Day [], today: string): number => {
        const todayIso = parseISO(today);
        //проверяем наличие today в complited, если есть то начинаем проверку с сегодня, если нету то пропускаем потому что день еще не закончился
        let expected = habitCompleted[today]
            ? getInitialExpected(todayIso, schedule) 
            : getPreviousScheduledDate(todayIso, schedule)
        
        let streak = 0;

        const dates = Object.keys(habitCompleted).sort((a, b) => b.localeCompare(a));

        for (const date of dates) {
            const noteDate = parseISO(date);

            if (!isSameDay(noteDate, expected)) break; // с помощью parseISO из ISO в объект Date, isSameDay проверяет чтобы это были одинаковые даты

            expected = getPreviousScheduledDate(expected, schedule); // заменяем текущую дату на следующую по хронологии
            streak++
        }
        return streak;
    },

    calculateCompletionRate: (habitCompleted: HabitCompleted, schedule: Day [], today: string): number => {
        let doneDays = 0;
        const todayIso = parseISO(today);

        const days = eachDayOfInterval({
            start: subDays(todayIso, 29), // Date — 30 дней назад от сейчас
            end: todayIso
        });
        
        const allDays = days.filter(day => dates.isScheduledOn(schedule, day)); // отфильтровали по частоте
        
        allDays.forEach(day => {
            const toIso = format(day, "yyyy-MM-dd");
            if (habitCompleted[toIso]) doneDays++
        })

        return Math.round((doneDays / allDays.length) * 100)
    },
}