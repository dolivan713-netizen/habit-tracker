// HabitRow (Строка привычки)
// Это компонент одной конкретной привычки в списке. 

// Что внутри: Название привычки (например, «Сделать зарядку»), 
// текущий стрик (огонек с цифрой, которую считает твой метод calculateStreak), 
// кнопка удаления/редактирования и, скорее всего, сетка или линейка из дней недели, чтобы отмечать выполнение.

//получаем айди привычки, выполненые дни
import { useHabitSlice } from "../store/habitsSlice";
import DayCell from "./DayCell";
import { Group } from "@mantine/core";
import { subDays, eachDayOfInterval, isBefore, isSameDay, startOfDay, format } from 'date-fns';
import type { HabitCompletions, Habit, PropState } from "../types";

type Props = {
    complitedHabits: HabitCompletions
    habit: Habit
}

export default function HabitRow({complitedHabits, habit}: Props, ) {
    // возможно вынесу логику выше
    const today = new Date();
    const start = subDays(today, 6); //Генерируем массив от "6 дней назад" до "сегодня"
    const daysOfWeek = eachDayOfInterval({ start, end: today });

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
        if (!(habit.frequency as readonly number[]).includes(day.getDay())) {
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
        
        if (isSameDay(today, day)) {
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
                        key={format(day, 'yyyy-MM-dd')}
                        date={day}
                        state={stateProp}
                        click={fnProp}
                    />
                )
            })}
        </Group>
    )
}
