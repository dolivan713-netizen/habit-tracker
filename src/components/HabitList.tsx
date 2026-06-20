import { Stack, Text, Center } from "@mantine/core";
import { useHabitSlice } from "../store/habitsSlice";
import useFilteredHabits from "../hooks/useFilteredHabits";
import { useUiSlice } from "../store/uiSlice";
import HabitRow from "./HabitRow";

export default function HabitList() {
    const completed = useHabitSlice(state => state.completions);
    const habits = useHabitSlice(state => state.habits);
    const filters = useUiSlice(state => state.filter);
    const today = new Date();
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
                        complitedHabits={completed[habit.id]}
                        habit={habit}
                    />
                ))}
            </Stack>
        </>
    )
}
