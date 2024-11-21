import { EventDaysInfo } from "./events";

interface EventReport extends EventDaysInfo {
  totals: Totals;
}

interface Totals {
  totalHours: number;
  totalAddons: string;
  totalRates: string;
  total: string;
}

export { EventReport, Totals };
