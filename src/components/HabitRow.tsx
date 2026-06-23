import { useHabitSlice } from "../store/habitsSlice";
import DayCell from "./DayCell";
import { Group, Button, Text, TextInput } from "@mantine/core";
import { subDays, eachDayOfInterval, isBefore, isSameDay, startOfDay, format, parseISO } from 'date-fns';
import type { HabitCompletions, Habit, PropState } from "../types";
import { dates } from "../lib/dates";
import { useState, useRef } from "react";

type Props = {
    today: string
    complitedHabits: HabitCompletions
    habit: Habit
}

export default function HabitRow({today, complitedHabits, habit}: Props, ) {
    const [isEditing, setEditing] = useState(false);
    const [value, setValue] = useState('');
    const isCancellingRef = useRef(false);
    const todayIso = parseISO(today);
    const isScheduledOn = dates.isScheduledOn;
    const start = subDays(todayIso, 6); //Генерируем массив от "6 дней назад" до "сегодня"
    const daysOfWeek = eachDayOfInterval({ start, end: todayIso });

    const deleteHabit = useHabitSlice(state => state.deleteHabit);
    const editHabit = useHabitSlice(state => state.editHabit);
    const doneDay = useHabitSlice(state => state.doneDay);
    const cancelDoneHabit = useHabitSlice(state => state.cancelDoneHabit);
    const streak = dates.calculateStreak;

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (value.trim()) editHabit(habit.id, value.trim());
            setEditing(false);
            setValue('');
        }

        if (e.key === 'Escape') {
            isCancellingRef.current = true;
            setEditing(false);
            setValue('');
        }
    };

    const handleBlur = () => {
        if (isCancellingRef.current) {
            isCancellingRef.current = false;
            return;
        }

        if (value.trim()) editHabit(habit.id, value.trim());
        setEditing(false);
        setValue('');

    }
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
            <Text>{habit.color}</Text>

            {!isEditing && <Text>{habit.name}</Text>}

            {isEditing && <TextInput
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={() => handleBlur()}
                onKeyDown={(e) => handleKeyDown(e)}
                placeholder={habit.name}
                autoFocus
            />}
            
            <Text>{streak(complitedHabits, habit.frequency, today)}</Text>

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

            <Button onClick={() => setEditing(true)}>✏️</Button>
            <Button onClick={() => deleteHabit(habit.id)}>🗑️</Button>
        </Group>
    )
}
