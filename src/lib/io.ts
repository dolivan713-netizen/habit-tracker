import z from "zod";
import { parseISO, isFuture} from "date-fns";
import type { Habit, Completed } from "../types";

export type ResultImport = {ok: true, data: {habits: Habit[], completed: Completed }} | {ok: false, error: string};


const HabitSchema = z.array(z.object({
    id: z.string(),
    name: z.string(),
    color: z.string(),
    createdAt: z.string().date("createdAt неверный формат даты").refine(
        v => !isFuture(parseISO(v)),
        "Дата создания не может быть в будущем"
    ),
    frequency: z.array(
        z.union([
            z.literal(0), z.literal(1), z.literal(2), z.literal(3),
            z.literal(4), z.literal(5), z.literal(6),
        ])
    ).min(1, "Нужен хотя бы один день")
}));

export type ImportHabits = z.infer<typeof HabitSchema>

const CompletedSchema = z.record(
    z.string(), 
    z.record(z.string().date(), z.literal(true), {
        error: (iss) => iss.code === 'invalid_key'
            ? 'В completed ключи должны быть датами yyyy-mm-dd'
            : undefined
    }) // date() проверка на yyyy-mm-dd
) 

const ImportSchema = z.object({
    habits: HabitSchema,
    completed: CompletedSchema
})

export const io = {
    
    exportState: (habits: Habit[], completed: Completed) => {
        return JSON.stringify({habits, completed })
    },

    importState: (raw: string): ResultImport => {
        let parsed;
        
        try {
            parsed = JSON.parse(raw);
        } catch {
            return {ok: false, error: 'битый JSON'};
        }
        
        const schemeParse = ImportSchema.safeParse(parsed);

        if(!schemeParse.success) {
            return {ok: false, error: schemeParse.error.issues[0].message};
        }

        const habitsId = new Set(schemeParse.data.habits.map((h) => h.id));

        const checkId = Object.keys(schemeParse.data.completed).every(completId => {
            return habitsId.has(completId);
        })

        if(!checkId) return {ok: false, error: 'id не совпадают'};

        return {ok: true, data: schemeParse.data}
    }
}