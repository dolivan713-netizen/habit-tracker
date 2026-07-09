import { describe, it, expect } from 'vitest'
import { io } from './io';
import { addDays, format } from "date-fns";


describe('import', () => {
  const importTest = io.importState;
  
  it('правильный формат', () => {
    const habits = [
      {
        id: "a1b2c3",
        name: "Читать 30 минут",
        color: "#4caf50",
        createdAt: "2026-06-01",
        frequency: [1, 3, 5],
      },
      {
        id: "d4e5f6",
        name: "Зарядка",
        color: "#2196f3",
        createdAt: "2026-05-15",
        frequency: [0, 1, 2, 3, 4, 5, 6],
      }
    ];
  const completed = {"a1b2c3": {"2026-06-02": true}, "d4e5f6": {"2026-05-15": true}};
  const jsonValidHabits = JSON.stringify({habits, completed});
    expect(importTest(jsonValidHabits)).toEqual({ok: true, data: {habits, completed}})
  })

  it('пустая frequency', () => {
    const nullFrequency = [{ id: "x1", name: "Q", color: "#000000", createdAt: "2026-01-01", frequency: [] }];
    const completedFrequency = {'x1': {}};
    const jsonFrequency = JSON.stringify({habits: nullFrequency, completed: completedFrequency});
    expect(importTest(jsonFrequency)).toEqual({ok: false, error: "Нужен хотя бы один день"})
  })

  it('невалидная дата создания', () => {
    const validCreateAt = [{
      id: "a1b2c3",
      name: "Читать 30 минут",
      color: "#4caf50",
      createdAt: "2026-06-",
      frequency: [1, 3, 5],
    }]
    const completedCreateAt = {'a1b2c3': {}};
    const jsonCreateAt = JSON.stringify({habits: validCreateAt, completed: completedCreateAt})
    expect(importTest(jsonCreateAt)).toEqual({ok: false, error: "createdAt неверный формат даты"})
  })

  it('дата создания в будущем', () => {
    const futureDate = format(addDays(new Date(), 5), "yyyy-MM-dd");
    const habitsFuture = [{
      id: "a1b2c3",
      name: "Читать 30 минут",
      color: "#4caf50",
      createdAt: futureDate,
      frequency: [1, 3, 5],
    }]
    
    const completedFuture = {'a1b2c3': {}};
    const jsonFuture = JSON.stringify({habits: habitsFuture, completed: completedFuture})
    expect(importTest(jsonFuture)).toEqual({ok: false, error: "Дата создания не может быть в будущем"})
  })

  it('id в habits и completed не совпадают', () => {
    const completedIdNo = {'x2': {}};
    const habitsId = [{ id: "x1", name: "Q", color: "#000000", createdAt: "2026-01-01", frequency: [1] }];
    const jsonIdCompeted = JSON.stringify({habits: habitsId, completed: completedIdNo});
    expect(importTest(jsonIdCompeted)).toEqual({ok: false, error: 'id не совпадают'})
  })

  it('битый JSON', () => {
    const brokenJson = '{ "habits": [}'; 
    expect(importTest(brokenJson)).toEqual({ok: false, error: 'битый JSON'})
  })

  it('проверка на формат yyyy-mm-dd в completed', () => {
    const habits = [{ id: 'x111', name: "Q", color: "#000000", createdAt: "2026-01-03", frequency: [0, 1, 2, 3, 4, 5, 6] }];
    const completedFormat = {'x111': {'2026.01.04': true}};
    const jsonFormat = JSON.stringify({habits, completed: completedFormat});
    expect(importTest(jsonFormat)).toEqual({ok: false, error: 'В completed ключи должны быть датами yyyy-mm-dd'})
  })
})
