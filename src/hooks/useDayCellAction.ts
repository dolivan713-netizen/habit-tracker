import { isBefore, isSameDay, startOfDay, format, parseISO } from 'date-fns';
import type { PropState, HabitCompletions } from '../types';
import type { Day } from "date-fns";
import { dates } from '../lib/dates';
import { useHabitSlice } from '../store/habitsSlice';

type Props = {
    daysOfWeek: Date[],
    id: string
    createdAt: string
    frequency: Day[]
    today: string
    complitedHabits: HabitCompletions

}

type DayCell = { stateProp: PropState, fnProp: (() => void) | undefined, day: Date };

type Result = Array<DayCell>;

export default function useDayCellAction({daysOfWeek, id, createdAt, today, frequency, complitedHabits}: Props): Result {

    const doneDay = useHabitSlice(state => state.doneDay);
    const cancelDoneHabit = useHabitSlice(state => state.cancelDoneHabit);
    const isScheduledOn = dates.isScheduledOn;
    const todayIso = parseISO(today);

    return daysOfWeek.map(day => {
    
        let stateProp: PropState = 'disabled';
        let fnProp: (() => void) | undefined = undefined;
        const dayFormat = format(day, 'yyyy-MM-dd');

        //проверка чтобы последний день был не раньше даты создания привычеки, если раньше то день обычный
        const checkDate = isBefore(day, startOfDay(new Date(createdAt))); 
        if (checkDate) {
            return {
                stateProp, fnProp, day
            }
        }
        //проверка что должен быть в схеме дней недели, если есть то проверка на выполнение, при проверке на выполнение проверяем чтобы было не сегодня
        if (!(isScheduledOn(frequency, day))) {
            return {
                stateProp, fnProp, day
            }
        }
        
        if (complitedHabits[dayFormat] !== undefined) {
            stateProp = 'completed';
            fnProp = () => cancelDoneHabit(id, dayFormat)
            return {
                stateProp, fnProp, day
            }
        }
        
        if (isSameDay(todayIso, day)) {
            stateProp = 'active';
            fnProp = () => doneDay(id, dayFormat)
            return {
                stateProp, fnProp, day
            }
        }
        
        stateProp = 'failed';
        return {
                stateProp, fnProp, day
            }
    })
}
    