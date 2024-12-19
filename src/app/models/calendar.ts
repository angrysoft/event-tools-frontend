
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
  color: string | null;
  info: string | null;
  accepted: boolean;
  dayOff: boolean;
  state:string;
}
export { CalendarDay, CalendarEvent };
