
interface CalendarDay {
  day: number;
  weekName: string;
  events: CalendarEvent[];
}

interface CalendarEvent {
  id: number;
  startDate: string;
  event: number;
  eventName: string;
  eventNumber: string;
  color: string;
  info: string | null;
}
export { CalendarDay };