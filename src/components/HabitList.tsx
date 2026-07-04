import { Stack, Text, Center} from "@mantine/core";
import { useHabitSlice } from "../store/habitsSlice";
import useFilteredHabits from "../hooks/useFilteredHabits";
import { useUiSlice } from "../store/uiSlice";
import HabitRow from "./HabitRow";
import useToday from "../hooks/useToday";

export default function HabitList() {
    const completed = useHabitSlice(state => state.completed);
    const habits = useHabitSlice(state => state.habits);
    const filters = useUiSlice(state => state.filter);
    const today = useToday();
    const sortedHabit = useFilteredHabits({completed, habits, filters, today});
    
    
    return (
        <>
            {sortedHabit.length === 0 && (
                <Center p="xl">
                    <Stack align="center" gap="xs">
                        <Text c="dimmed" size="sm">Ни одна привычка не подходит под фильтры</Text>
                    </Stack>
                </Center>
            )}
            <Stack gap="md">
                {sortedHabit.map(habit => (
                    <HabitRow
                        key={habit.id}
                        today={today}
                        complitedHabits={completed[habit.id]}
                        habit={habit}
                    />
                ))}
            </Stack>
        </>
    )
}