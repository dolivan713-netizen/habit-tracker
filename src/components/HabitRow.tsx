import { useHabitSlice } from "../store/habitsSlice";
import DayCell from "./DayCell";
import { Group, Button } from "@mantine/core";
import { subDays, eachDayOfInterval, isBefore, isSameDay, startOfDay, format, parseISO } from 'date-fns';
import type { HabitCompletions, Habit, PropState } from "../types";
import { dates } from "../lib/dates";

type Props = {
    today: string
    complitedHabits: HabitCompletions
    habit: Habit
}

export default function HabitRow({today, complitedHabits, habit}: Props, ) {
    const todayIso = parseISO(today)
    const isScheduledOn = dates.isScheduledOn;
    const deleteHabit = useHabitSlice(state => state.deleteHabit)
    const start = subDays(todayIso, 6); //Генерируем массив от "6 дней назад" до "сегодня"
    const daysOfWeek = eachDayOfInterval({ start, end: todayIso });

    const doneDay = useHabitSlice(state => state.doneDay);
    const cancelDoneHabit = useHabitSlice(state => state.cancelDoneHabit);

    function stateAction(day: Date) {
        let stateProp: PropState = 'disabled';
        let fnProp: (() => void) | undefined = undefined;
        //проверка чтобы последний день был не раньше даты создания привычеки, если раньше то день обычный
        const checkDate = isBefore(day, startOfDay(new Date(habit.createdAt))); 
        if (checkDate) {
            return {
                stateProp, fnProp
            }
        }
        //проверка что должен быть в схеме дней недели, если есть то проверка на выполнение, при проверке на выполнение проверяем чтобы было не сегодня
        if (!(isScheduledOn(habit.frequency, day))) {
            return {
                stateProp, fnProp
            }
        }
        
        if (complitedHabits[format(day, 'yyyy-MM-dd')] !== undefined) {
            stateProp = 'completed';
            fnProp = () => cancelDoneHabit(habit.id, format(day, 'yyyy-MM-dd'))
            return {
                stateProp, fnProp
            }
        }
        
        if (isSameDay(todayIso, day)) {
            stateProp = 'active';
            fnProp = () => doneDay(habit.id, format(day, 'yyyy-MM-dd'))
            return {
                stateProp, fnProp
            }
        }
        
        stateProp = 'failed';
        return {
            stateProp, fnProp
        }
    }
    
    return (
        <Group>
            {daysOfWeek.map(day => {
                const {stateProp, fnProp} = stateAction(day)
                
                return (
                    <DayCell
                        key={format(day,'yyyy-MM-dd')}
                        date={day}
                        state={stateProp}
                        click={fnProp}
                    />
                )
            })}
            <Button>✏️</Button>
            <Button onClick={() => deleteHabit(habit.id)}>🗑️</Button>
        </Group>
    )
}
