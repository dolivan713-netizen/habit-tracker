import { isBefore, isSameDay, startOfDay, format, parseISO } from 'date-fns';
import type { PropState, HabitCompletions } from '../types';
import type { Day } from "date-fns";
import { useHabitSlice } from '../store/habitsSlice';
import { dates } from '../lib/dates';

type Props = {
    day: Date,
    createdAt: string
    frequency: Day[]
    id: string
    today: string
    complitedHabits: HabitCompletions

}

export default function useDayCellAction({day, createdAt, frequency, id, today, complitedHabits}: Props) {
    const doneDay = useHabitSlice(state => state.doneDay);
    const cancelDoneHabit = useHabitSlice(state => state.cancelDoneHabit);
    const isScheduledOn = dates.isScheduledOn;

    const todayIso = parseISO(today);

    let stateProp: PropState = 'disabled';
    let fnProp: (() => void) | undefined = undefined;

    //проверка чтобы последний день был не раньше даты создания привычеки, если раньше то день обычный
    const checkDate = isBefore(day, startOfDay(new Date(createdAt))); 
    if (checkDate) {
        return {
            stateProp, fnProp
        }
    }
    //проверка что должен быть в схеме дней недели, если есть то проверка на выполнение, при проверке на выполнение проверяем чтобы было не сегодня
    if (!(isScheduledOn(frequency, day))) {
        return {
            stateProp, fnProp
        }
    }
    
    if (complitedHabits[format(day, 'yyyy-MM-dd')] !== undefined) {
        stateProp = 'completed';
        fnProp = () => cancelDoneHabit(id, format(day, 'yyyy-MM-dd'))
        return {
            stateProp, fnProp
        }
    }
    
    if (isSameDay(todayIso, day)) {
        stateProp = 'active';
        fnProp = () => doneDay(id, format(day, 'yyyy-MM-dd'))
        return {
            stateProp, fnProp
        }
    }
    
    stateProp = 'failed';
    return {
        stateProp, fnProp
    }
}