// ┌─────────────────────────────────────────────────────────────┐
// │  Habit Tracker (4)                        [Экспорт] [Импорт]│  ← title + кнопки
// ├─────────────────────────────────────────────────────────────┤
// │  Фильтры: [только активные сегодня] [скрыть выполненные]   │
// │  Сортировка: [по алфавиту] [по streak] [по дате создания]  │
// ├─────────────────────────────────────────────────────────────┤
// │  🔴 Бегать        streak: 5д    30д: 87%                    │
// │  [01][02][03][04][05][06][07]...[30]          [✏️] [🗑️]    │  ← 30 ячеек
// │                                                             │
// │  🔵 Читать        streak: 12д   30д: 93%                    │
// │  [01][02][03][04][05][06][07]...[30]          [✏️] [🗑️]    │
// │                                                             │
// │  🟢 Медитация     streak: 0д    30д: 40%                    │
// │  [01][02][03][04][05][06][07]...[30]          [✏️] [🗑️]    │
// ├─────────────────────────────────────────────────────────────┤
// │  [+ Добавить привычку]                                      │  ← форма
// │  Название: [        ]  Цвет: [🔴]                           │
// │  Период: [каждый день] [по будням] [пн][вт][ср][чт][пт]    │
// └─────────────────────────────────────────────────────────────┘
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