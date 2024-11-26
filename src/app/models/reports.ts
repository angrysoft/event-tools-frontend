import { EventDaysInfo, WorkerDay } from "./events";

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
  name: string;
  reportDate: string;
  workerDays: EventWorkerDay[];
  totals: MonthTotal;
}

interface EventWorkerDay {
  eventName: string;
  eventNumber: string;
  workerDay: WorkerDay;
}

export { EventReport, MonthReport, Totals, EventWorkerDay};

