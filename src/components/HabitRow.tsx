import { useHabitSlice } from "../store/habitsSlice";
import DayCell from "./DayCell";
import EditingTitle from "./EditingTitle";
import { Group, Button, Text } from "@mantine/core";
import { subDays, eachDayOfInterval, format, parseISO } from 'date-fns';
import type { HabitCompleted, Habit} from "../types";
import { dates } from "../lib/dates";
import { useState } from "react";
import useDayCellAction from "../hooks/useDayCellAction";

type Props = {
    today: string
    complitedHabits: HabitCompleted
    habit: Habit
}

export default function HabitRow({today, complitedHabits, habit}: Props, ) {
    const [isEditing, setEditing] = useState(false);
    const todayIso = parseISO(today);
    const start = subDays(todayIso, 6); //Генерируем массив от "6 дней назад" до "сегодня"
    const daysOfWeek = eachDayOfInterval({ start, end: todayIso });
    
    const cellDays = useDayCellAction({daysOfWeek, id: habit.id, createdAt: habit.createdAt, frequency: habit.frequency, today, complitedHabits});

    const deleteHabit = useHabitSlice(state => state.deleteHabit);
    const streak = dates.calculateStreak;

    function handleEditing() {
        setEditing(false);
    }

    return (
        <Group>
            <Text>{habit.color}</Text>

            <EditingTitle
                editing={isEditing}
                id={habit.id}
                name={habit.name}
                onEditing={handleEditing}

            />

            <Text>{streak(complitedHabits, habit.frequency, today)}</Text>

            {cellDays.map(cellDay => {
                const { stateProp, fnProp, day} = cellDay;
                
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
