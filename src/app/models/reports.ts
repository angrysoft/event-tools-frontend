import { EventDay, EventDaysInfo } from "./events";

interface EventReport extends EventDaysInfo {
  totals: Totals;
}

interface Totals {
  totalHours: number;
  totalAddons: string;
  totalRates: string;
  total: string;
}

interface MonthTotal extends Totals {
  basicPay: number;
}

interface MonthReport {
  info: Info;
  eventDays: EventDay[];
  totals: MonthTotal;
}

interface Info {
  name: string;
  date: string;
}

export { EventReport, Totals, MonthReport, Info };
