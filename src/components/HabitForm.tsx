import { useHabitSlice } from "../store/habitsSlice";
import { Stack, TextInput, Button, Switch, Select, Text } from "@mantine/core";
import { useState } from "react";
import type { Day } from "date-fns";
import type { NewHabit } from "../types";

type Days = 'sunday' | 'monday'| 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';

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
        <Stack gap="md">

            <TextInput 
                label="Название"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <Switch
                label="Каждый день"
                checked={period.everyDay}
                onChange={() => setPeriod(prev => ({...prev, everyDay: !prev.everyDay, onWeekDays: false}))}// почему так??
            />

            <Switch
                label="По будням"
                checked={period.onWeekDays}
                onChange={() => setPeriod(prev => ({...prev, onWeekDays: !prev.onWeekDays, everyDay: false}))}
            />

            {daysOfWeek.map((day: Days) => (
                <Switch
                    key={day}
                    label={day}
                    checked={period.week[day]}
                    onChange={() => handleAddHabit(day)}
                />
            ))}
        
            <Select 
                label='Цвет'
                data={[
                    { value: "#F44336", label: 'Красный' },
                    { value: "#2196F3", label: 'Синий' },
                    { value: "#4CAF50", label: 'Зеленый' },
                    { value: "#9C27B0", label: 'Фиолетовый'},
                    { value: "#FF9800", label: 'Оранжевый'},
                    { value: "#607D8B", label: 'Серо-синий'}
                ]}
                value={color}
                onChange={(val) => {
                    if (val) setColor(val)
                }}
            />

            {error && (<Text color="red" size="md">{error}</Text>)}

            <Button 
                onClick={() => addHabitCheck()}
            >Добавить привычку
            </Button>
        </Stack>
    )
}