import { FormArray, FormControl } from "@angular/forms";

interface EventItem {
  id: number;
  name: string;
  number: string;
  description: string;
  coordinatorId: number;
  accountManagerId: number;
  chiefId: number;
  eventChiefs: number[];
}

interface EventItemForm {
  id: FormControl<number | null>;
  name: FormControl<string | null>;
  number: FormControl<string | null>;
  description: FormControl<string | null>;
  coordinatorId: FormControl<number | null>;
  accountManagerId: FormControl<number | null>;
  chiefId: FormControl<number | null>;
  eventChiefs: FormArray;
}

interface EventItemDto {
  id: number;
  name: string;
  number: string;
  description: string;
  coordinator: string;
  accountManager: string;
  chief: string;
  editors: string[];
}

interface EventFile {
  event: {
    id: number;
  };
  fileName: string;
  size: number;
}

interface WorkerDay {
  id?: number | null;
  eventDay?: number | null;
  worker?: number | null;
  rate?: number | null;
  startTime: string | Date;
  endTime: string | Date;
  workerName?: string;
  rateName?: string;
  rateMoney?: string;
  rateValue?: string;
  workHours?: number;
  total?: string;
  addons?: string;
  workerDayAddons: WorkerAddons[];
  state?:string;
}

interface WorkerDayForm {
  id: FormControl<number | null>;
  eventDay: FormControl<number | null>;
  rate: FormControl<number | null>;
  startTime: FormControl<Date  | null>;
  endTime: FormControl<Date  | null>;
  workers: FormArray;
  workerDayAddons: FormArray;
}

interface WorkerAddons {
  eventDay: number;
  worker: number;
  value?: number;
  money?: string;
  name: string;
  type: string;
}

interface EventDaysInfo {
  info: EventItemDto;
  eventDays: EventDay[];
}

interface EventDay {
  id?: number;
  event: number;
  info: string;
  startDate: Date | string;
  state: string;
  workerDays: WorkerDay[];
}

interface WorkerDayStatusPayload {
  status: string;
  eventDays: number[];
}

interface DuplicateDaysPayload {
  from: string;
  to: string;
  workerDays: number[];
}

interface WorkersRateDay {
  workerDay: FormControl<number | null>;
  workerName: FormControl<string | null>;
  worker: FormControl<number | null>;
  rate: FormControl<number | null>;
  rates: FormControl<number[] | null>;
  workerDayAddons: FormArray;
}

interface ChangeWorkerPayload {
  worker: number;
  workerName: string;
  workerDay: number;
}

export {
  EventItem,
  EventItemForm,
  EventItemDto,
  EventFile,
  EventDay,
  WorkerDay,
  WorkerDayForm,
  WorkerAddons,
  WorkerDayStatusPayload,
  DuplicateDaysPayload,
  WorkersRateDay,
  ChangeWorkerPayload,
  EventDaysInfo,
};
