import { format } from "date-fns";

export default function useToday() {
    return format(new Date(), 'yyyy-MM-dd');
}