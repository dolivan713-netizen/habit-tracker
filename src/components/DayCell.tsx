// DayCell (Ячейка дня)
// Это как раз маленькая составная часть для HabitRow. Квадратик (или кружок) конкретного дня (например, «Пн», «Вт» или «26 мая»).

// Что внутри: Инкапсулирует в себе логику клика. Ты тапаешь по нему — отправляется экшен в стор, и дата заносится в habitCompletions.

// Визуал: Он меняет цвет в зависимости от статуса: зеленый (если привычка выполнена), серый (если день еще не наступил/неактивен), 
// или красный/пустой (если день пропущен). 
// Из таких ячеек выстраивается красивый календарь прогресса (как контрибьюты на GitHub).

// [  ] — день не отмечен (кликабельно)
// [✅] — день отмечен
// [·]  — день не входит в расписание привычки (не кликабельно, серый)
// [>]  — сегодня
import { ActionIcon, Text } from "@mantine/core"
import { useHabitSlice } from "../store/habitsSlice";
type Props = {
    date: Date
    state: 'disabled' | 'active' | 'failed' | 'completed'
    click: () => void
}
export default function DayCell({date, state, click}: Props) {
    const getColor = () => {
        switch (state) {
        case 'completed': return 'green';
        case 'failed': return 'red';
        case 'active': return 'blue'; // сегодняшний активный день
        default: return 'gray'; // задизейбленный день (будущее)
        }
    };
    
    
    return (
        <ActionIcon
      variant={state === 'completed' ? 'filled' : 'light'}
      color={getColor()}
      disabled={state === 'disabled'}
      onClick={click}
      size="lg"
      radius="md"
    >
      {/* Выводим просто число месяца, например: 26 */}
      <Text size="xs">{date.getDate()}</Text>
    </ActionIcon>
    )
}
// механика нажатия: если это день в котопый нужно выполнять привычку то при нажатии пометка выполнено, если это обычный день то ничего
// нужно узнать ка при нажатии менять цвет