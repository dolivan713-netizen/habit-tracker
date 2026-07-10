import { useHabitSlice } from "../store/habitsSlice";
import DayCell from "./DayCell";
import EditingTitle from "./EditingTitle";
import { Group, ActionIcon, Text, ColorSwatch, Paper } from "@mantine/core";
import { subDays, eachDayOfInterval, format, parseISO } from 'date-fns';
import type { HabitCompleted, Habit} from "../types";
import { dates } from "../lib/dates";
import { useState } from "react";
import useDayCellAction from "../hooks/useDayCellAction";

type Props = {
    today: string
    habitCompleted: HabitCompleted
    habit: Habit
}

export default function HabitRow({today, habitCompleted, habit}: Props, ) {
    const [isEditing, setEditing] = useState(false);
    const todayIso = parseISO(today);
    const start = subDays(todayIso, 6); //Генерируем массив от "6 дней назад" до "сегодня"
    const daysOfWeek = eachDayOfInterval({ start, end: todayIso });
    
    const cellDays = useDayCellAction({daysOfWeek, id: habit.id, createdAt: habit.createdAt, frequency: habit.frequency, today, habitCompleted});

    const deleteHabit = useHabitSlice(state => state.deleteHabit);
    const bestStreak = dates.calculateBestStreak;
    const streak = dates.calculateStreak;
    const rating = dates.calculateCompletionRate;

    function handleEditing() {
        setEditing(false);
    }

    return (
        <Paper withBorder p="sm">
            <Group justify="space-between" wrap="nowrap">

                <Group gap="sm" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
                    <ColorSwatch
                        color={habit.color}
                        size={28}
                        radius="xl"
                        withShadow={false}
                    />
                    <EditingTitle
                        editing={isEditing}
                        id={habit.id}
                        name={habit.name}
                        onEditing={handleEditing}
                    />
                </Group>

                <Group gap="md" wrap="nowrap">
                    <Text size="sm" c="dimmed">Рекорд: {bestStreak(habitCompleted, habit.frequency, today)}</Text>
                    <Text size="sm" c="dimmed">Подряд: {streak(habitCompleted, habit.frequency, today)}</Text>
                    <Text size="sm" c="dimmed">30д: {rating(habitCompleted, habit.frequency, today)}%</Text>
                </Group>

                <Group gap={4} wrap="nowrap">
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
                </Group>

                <Group gap={4} wrap="nowrap">
                    <ActionIcon variant="subtle" size="lg" aria-label="Редактировать" onClick={() => setEditing(true)}>✏️</ActionIcon>
                    <ActionIcon variant="subtle" color="red" size="lg" aria-label="Удалить" onClick={() => deleteHabit(habit.id)}>🗑️</ActionIcon>
                </Group>

            </Group>
        </Paper>
    )
}
