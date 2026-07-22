import { ActionIcon, Text } from "@mantine/core"
import type { PropsDayCell } from "../types";

export default function DayCell({date, state, click}: PropsDayCell) {
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
        disabled={state === 'disabled' || !click}
        onClick={click}
        size="lg"
        radius="md"
      >
      <Text size="xs">{date.getDate()}</Text>
    </ActionIcon>
    )
}
