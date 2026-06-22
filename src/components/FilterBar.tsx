import { useUiSlice } from "../store/uiSlice";
import { useHabitSlice } from "../store/habitsSlice";
import { Group, Title, Select, Switch } from "@mantine/core";

export default function FillterBar() {
    const habits = useHabitSlice(state => state.habits);
    const {onlyDueToday, hideCompletedToday, sortBy} = useUiSlice(state => state.filter);
    const toggleFilter = useUiSlice(state => state.toggleFilter);
    const toggleSort = useUiSlice(state => state.toggleSort);
    
    return(
        /* Navbar */
        <Group justify="space-between" p="md">
            <Title order={2}>{`Habit tracker ${habits.length}`}</Title>
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
        </Group>
    )
}


//export type FilterBy = 'onlyDueToday' | 'hideCompletedToday';


{/* <Select
  label="Выбери"
  data={['React', 'Vue', 'Svelte']}
/> */}