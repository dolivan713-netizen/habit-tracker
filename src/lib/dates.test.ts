import { describe, it, expect } from 'vitest'
import { dates } from './dates'
import type { Day } from 'date-fns';
import type { HabitCompleted } from '../types';



describe('calculateStreak', () => {
    const streak = dates.calculateStreak;
    const bestStreak = dates.calculateBestStreak;
    const days: Day[]  = [0,1,2,3,4,5,6];
    const today = '2026-06-28';
  it('возвращает 0 для пустого списка', () => {
    expect(streak({}, days, today)).toBe(0)
  })

  it('возвращает 1 если выполнено сегодня', () => {
    expect(streak({'2026-06-28': true}, days, today)).toBe(1)
  })

  it('5 дней подряд, сегодня в расписании, сегодня отмечен', () => {
    const fiveDays: HabitCompleted = {
        '2026-06-24': true, 
        '2026-06-26': true, 
        '2026-06-25': true, 
        '2026-06-27': true, 
        '2026-06-28': true
    }
    expect(streak(fiveDays, days, today)).toBe(5)
  })

  it('5 дней подряд, сегодня в расписании, сегодня НЕ отмечен → streak 5 (льгота)', () => {
    const fiveDaysToday: HabitCompleted = {
        '2026-06-23': true, 
        '2026-06-24': true, 
        '2026-06-25': true, 
        '2026-06-26': true, 
        '2026-06-27': true
    };
    expect(streak(fiveDaysToday, days, today)).toBe(5)
  })

  it('5 дней подряд, потом провал, потом 3 → best 5', () => {
    const date: HabitCompleted = {
        '2026-06-19': true, 
        '2026-06-20': true, 
        '2026-06-21': true, 
        '2026-06-22': true, 
        '2026-06-23': true, 
        '2026-06-25': true, 
        '2026-06-26': true, 
        '2026-06-27': true
    };
    expect(bestStreak(date, days, today)).toBe(5)
  })

  it('5 дней подряд, потом провал, потом 3 → current 3', () => {
    const date: HabitCompleted = {
        '2026-06-19': true, 
        '2026-06-20': true, 
        '2026-06-21': true, 
        '2026-06-22': true, 
        '2026-06-23': true, 
        '2026-06-25': true, 
        '2026-06-26': true, 
        '2026-06-27': true
    };
    expect(streak(date, days, today)).toBe(3)
  })

  it('сегодня есть в кастомном расписании + пропуск дня-> current 2', () => {
    const schedule: Day[] = [1, 3, 0]; // Пн/Ср/Вс
    const completions: HabitCompleted = {
        '2026-06-14': true,
        '2026-06-15': true, 
        '2026-06-17': true, 
        '2026-06-22': true,
        '2026-06-24': true
    }
    expect(streak(completions, schedule, today)).toBe(2)
  })

  it('сегодня есть в кастомном расписании + пропуск дня-> best 3', () => {
    const schedule: Day[] = [1, 3, 0]; // Пн/Ср/Вс
    const completions: HabitCompleted = {
        '2026-06-14': true,
        '2026-06-15': true, 
        '2026-06-17': true, 
        '2026-06-22': true,
        '2026-06-24': true
    }
    expect(bestStreak(completions, schedule, today)).toBe(3)
  })
})