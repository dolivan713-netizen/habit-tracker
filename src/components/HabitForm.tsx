import { useHabitSlice } from "../store/habitsSlice";
import { Stack, TextInput, Button, Switch, Text, Group, ColorSwatch, Paper } from "@mantine/core";
import { useState } from "react";
import type { Day } from "date-fns";
import type { NewHabit } from "../types";

type Days = 'sunday' | 'monday'| 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';

const COLORS = [
    { value: "#F44336", label: 'Красный' },
    { value: "#2196F3", label: 'Синий' },
    { value: "#4CAF50", label: 'Зелёный' },
    { value: "#9C27B0", label: 'Фиолетовый' },
    { value: "#FF9800", label: 'Оранжевый' },
    { value: "#607D8B", label: 'Серо-синий' },
];

const DAY_LABELS: Record<Days, string> = {
    monday: 'Пн',
    tuesday: 'Вт',
    wednesday: 'Ср',
    thursday: 'Чт',
    friday: 'Пт',
    saturday: 'Сб',
    sunday: 'Вс',
};

export default function HabitForm() {
    
    const addHabit = useHabitSlice(state => state.addHabit);
    const [name, setName] = useState('');
    const [color, setColor] = useState(''); 
    const [error, setError] = useState('');
    const [period, setPeriod] = useState({
        everyDay: false,
        onWeekDays: false,
        week: {
            'monday': false,  
            'tuesday': false,
            'wednesday': false,
            'thursday': false,
            'friday': false,
            'saturday': false,
            'sunday': false
        }
    });
    const daysOfWeek: Days[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    function handleAddHabit(day: Days) {
        setPeriod(prev => ({
            ...prev,
            week: {
                ...prev.week,
                [day]: !prev.week[day]
            }
        }))
    }

    function checkDays() {
        const dayNumber = (dayString: string) => ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].indexOf(dayString.toLowerCase());
        
        if (period.onWeekDays) {
            return [1, 2, 3, 4, 5];
        } else if (period.everyDay) {
            return [0, 1, 2, 3, 4, 5, 6]
        } else { 
            return Object.entries(period.week).filter((value) => value[1]).map((keys) => dayNumber(keys[0])) as Day[];
        }
    }

    function addHabitCheck() {
        const days = checkDays() as Day[];
    
        if (name.length < 3) return setError('Не корректное имя')
        if (color === '') return setError('Цвет не выбран');
        if (days.length === 0) return setError('Частота привычки не выброна');

        const newHabit: NewHabit = {
            name: name,
            color: color,
            frequency: days
        }
    
        addHabit(newHabit);
        setColor('');
        setName('');
        setError('');
        setPeriod({
            everyDay: false,
            onWeekDays: false,
            week: {
                'monday': false,  
                'tuesday': false,
                'wednesday': false,
                'thursday': false,
                'friday': false,
                'saturday': false,
                'sunday': false
            }
        });
    }

    return (
        <Paper withBorder p="md">
            <Stack gap="md">

                <Group gap="lg" align="flex-end">
                    <TextInput
                        label="Название"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ flex: 1 }}
                    />

                    <Stack gap={6}>
                        <Text size="sm" fw={500}>Цвет</Text>
                        <Group gap="xs">
                            {COLORS.map(({ value, label }) => (
                                <ColorSwatch
                                    key={value}
                                    component="button"
                                    type="button"
                                    title={label}
                                    aria-label={label}
                                    onClick={() => setColor(value)}
                                    color={value}
                                    size={28}
                                    radius="xl"
                                    withShadow={false}
                                    style={{
                                        cursor: 'pointer',
                                        outline: value === color ? '2px solid var(--mantine-color-blue-5)' : undefined,
                                        outlineOffset: '2px',
                                    }}
                                />
                            ))}
                        </Group>
                    </Stack>
                </Group>

                <Stack gap={6}>
                    <Text size="sm" fw={500}>Период</Text>
                    <Group gap="md">
                        <Switch
                            label="Каждый день"
                            checked={period.everyDay}
                            onChange={() => setPeriod(prev => ({...prev, everyDay: !prev.everyDay, onWeekDays: false}))} 
                        />

                        <Switch
                            label="По будням"
                            checked={period.onWeekDays}
                            onChange={() => setPeriod(prev => ({...prev, onWeekDays: !prev.onWeekDays, everyDay: false}))}
                        />

                        {daysOfWeek.map((day: Days) => (
                            <Switch
                                key={day}
                                label={DAY_LABELS[day]}
                                checked={period.week[day]}
                                onChange={() => handleAddHabit(day)}
                            />
                        ))}
                    </Group>
                </Stack>

                <Group gap="md">
                    <Button onClick={() => addHabitCheck()}>Добавить привычку</Button>
                    {error && (<Text c="red" size="sm">{error}</Text>)}
                </Group>

            </Stack>
        </Paper>
    )
}