import { useUiSlice } from "../store/uiSlice";
import { useHabitSlice } from "../store/habitsSlice";
import { io } from "../lib/io";
import { notifications } from '@mantine/notifications';
import { Group, Flex, Title, Select, Switch, Button, FileButton } from "@mantine/core";


export default function FilterBar() {
    const habits = useHabitSlice(state => state.habits);

    const exportState = io.exportState;
    const importState = io.importState;

    const {onlyDueToday, hideCompletedToday, sortBy} = useUiSlice(state => state.filter);

    const toggleFilter = useUiSlice(state => state.toggleFilter);
    const toggleSort = useUiSlice(state => state.toggleSort);
    const importData =  useHabitSlice(state => state.importHabits);

    function exportClick() {
        const {habits, completed} = useHabitSlice.getState();
        const data = exportState(habits, completed);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "habits.json";
        a.click();
        URL.revokeObjectURL(url)
    }

    async function handleImport(file: File | null) {
        if(!file) return;

        const raw = await file.text();
        const result = importState(raw);

        if(result.ok) {
            if (habits.length > 0 && !window.confirm('Импорт заменит все текущие привычки. Продолжить?')) {
                return;
            }
            return importData(result.data);
        }

        notifications.show({
            title: 'Ошибка импорта',
            message: result.error,
            color: 'red',
        });
    }

    return(
        /* Navbar */
        <Flex
            direction={{ base: 'column', sm: 'row' }}
            justify="space-between"
            align={{ base: 'stretch', sm: 'flex-end' }}
            gap="md"
        >
            <Group>
                <Title order={2}>{`Habit tracker (${habits.length})`}</Title>

                <Button onClick={() => exportClick()}>Экспорт</Button>

                <FileButton onChange={handleImport} accept="application/json">
                    {(props) => <Button {...props}>Импорт</Button>}
                </FileButton>
            </Group>

            <Group>
                <Switch
                    label="Только активные сегодня"
                    checked={onlyDueToday}
                    onChange={() => toggleFilter('onlyDueToday')}
                />
                <Switch
                    label="Скрыть выполненные"
                    checked={hideCompletedToday}
                    onChange={() => toggleFilter('hideCompletedToday')}
                />
                <Select
                    label='Сортировка'
                    data={[
                        { value: 'name', label: 'По имени' },
                        { value: 'streak', label: 'По streak' },
                        { value: 'createdAt', label: 'По дате создания' }
                    ]}
                    value={sortBy}
                    onChange={(val) => {
                        if (val) toggleSort(val)
                    }}
                />
            </Group>
        </Flex>
    )
}
