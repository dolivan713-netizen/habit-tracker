import { Container, Stack } from "@mantine/core"
import FilterBar from "./components/FilterBar"
import HabitForm from "./components/HabitForm"
import HabitList from "./components/HabitList"
export default function App() {

    return (
        <Container size="lg" py="md">
            <Stack gap="md">
                <FilterBar />
                <HabitList />
                <HabitForm />
            </Stack>
        </Container>
    )
}