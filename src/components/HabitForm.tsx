import { useHabitSlice } from "../store/habitsSlice";
import { Stack, TextInput, Button, Switch, Text, Group, Flex, ColorSwatch, Paper } from "@mantine/core";
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

const EMPTY_WEEK: Record<Days, boolean> = {
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
};

const INITIAL_PERIOD = { everyDay: false, onWeekDays: false, week: EMPTY_WEEK };

export default function HabitForm() {

    const addHabit = useHabitSlice(state => state.addHabit);
    const [name, setName] = useState('');
    const [color, setColor] = useState('');
    const [error, setError] = useState('');
    const [period, setPeriod] = useState(INITIAL_PERIOD);
    const daysOfWeek: Days[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    function toggleDay(day: Days) {
        setPeriod(prev => ({
            everyDay: false,
            onWeekDays: false,
            week: {
                ...prev.week,
                [day]: !prev.week[day]
            }
        }))
    }

    function togglePreset(preset: 'everyDay' | 'onWeekDays') {
        setPeriod(prev => ({
            everyDay: preset === 'everyDay' ? !prev.everyDay : false,
            onWeekDays: preset === 'onWeekDays' ? !prev.onWeekDays : false,
            week: EMPTY_WEEK
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
        const trimmedName = name.trim();

        if (trimmedName.length < 3) return setError('Некорректное имя')
        if (color === '') return setError('Цвет не выбран');
        if (days.length === 0) return setError('Частота привычки не выбрана');

        const newHabit: NewHabit = {
            name: trimmedName,
            color: color,
            frequency: days
        }

        addHabit(newHabit);
        setColor('');
        setName('');
        setError('');
        setPeriod(INITIAL_PERIOD);
    }

    return (
        <Paper withBorder p="md">
            <Stack gap="md">

                <Flex
                    direction={{ base: 'column', sm: 'row' }}
                    align={{ base: 'stretch', sm: 'flex-end' }}
                    gap="lg"
                >
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
                </Flex>

                <Stack gap={6}>
                    <Text size="sm" fw={500}>Период</Text>
                    <Group gap="md">
                        <Switch
                            label="Каждый день"
                            checked={period.everyDay}
                            onChange={() => togglePreset('everyDay')}
                        />

                        <Switch
                            label="По будням"
                            checked={period.onWeekDays}
                            onChange={() => togglePreset('onWeekDays')}
                        />
                    </Group>

                    <Group gap="xs">
                        {daysOfWeek.map((day: Days) => (
                            <Switch
                                key={day}
                                label={DAY_LABELS[day]}
                                checked={period.week[day]}
                                onChange={() => toggleDay(day)}
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
