import { EventDaysInfo, EventItemDto, WorkerDay } from "./events";

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

interface FromDatesReport {
  name: string;
  fromDate: string;
  toDate: string;
  workerDays: EventWorkerDay[];
  totals: Totals;
}

interface EventWorkerDay {
  eventName: string;
  eventNumber: string;
  workerDay: WorkerDay;
  state: string;
}

interface DataWorkerDay {
  eventName: string;
  eventNumber: string;
  startTime: string | Date;
  endTime: string | Date;
  workHours: number;
  rateName: string;
  rateValue: string;
  addons: string;
  total: string;
  state: string;
}

interface DataTeamDay extends DataWorkerDay {
  workerName: string;
}

interface PlanExecutionReport {
  info: EventItemDto;
  days: EventPlanExecutionDay[];
  totalPlan: Totals;
  totalExecution: Totals;
}

interface EventPlanExecutionDay {
  id: number;
  startDate: string;
  planDay: WorkerDay[];
  eventDay: WorkerDay[];
}

interface FromDatesReportPayload {
  reportType: "workers" | "team" | null;
  from: string;
  to: string;
  members: string[] | number[];
  backTo: string;
}

export {
  DataTeamDay,
  DataWorkerDay,
  EventPlanExecutionDay,
  EventReport,
  EventWorkerDay,
  FromDatesReport,
  MonthReport,
  MonthTotal,
  PlanExecutionReport,
  Totals,
  FromDatesReportPayload,
};
