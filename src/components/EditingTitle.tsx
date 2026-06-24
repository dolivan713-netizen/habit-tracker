import { useRef, useState } from "react";
import { useHabitSlice } from "../store/habitsSlice";
import { Text, TextInput } from "@mantine/core";

type Props = {
    editing: true
    id: string
    name:string
    onEditing: () => void
}

export default function EditingTitle({editing, id, name, onEditing}: Props) {
    const [value, setValue] = useState('');
    const isCancellingRef = useRef(false);
    const editHabit = useHabitSlice(state => state.editHabit);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (value.trim()) editHabit(id, value.trim());
            onEditing();
            setValue('');
        }

        if (e.key === 'Escape') {
            isCancellingRef.current = true;
            onEditing();
            setValue('');
        }
    };

    const handleBlur = () => {
        if (isCancellingRef.current) {
            isCancellingRef.current = false;
            return;
        }

        if (value.trim()) editHabit(id, value.trim());
        onEditing();
        setValue('');

    }

    return (
        <>
            {!editing && <Text>{name}</Text>}
        
            {editing && <TextInput
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={() => handleBlur()}
                onKeyDown={(e) => handleKeyDown(e)}
                placeholder={name}
                autoFocus
            />}
        </>
    )
}