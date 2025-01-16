import { FormControl } from "@angular/forms";
import { Day } from "./schedule";

interface Car {
  id: number | null;
  workerId: number;
  name: string;
  registration: string;
  carDoc?: CarDoc[];
  company: boolean;
}

interface CarDoc {
  id: number | null;
  name: string | null;
  fileName: string | null;
  car: number | null;
  expirationDate: boolean | null;

  expire?: Date | string | null;
}

interface CarDocData extends CarDoc {
  expirationDate: boolean | null;
  file: File | null;
}

interface CarForm {
  id: FormControl<number | null>;
  workerId: FormControl<number | null>;
  name: FormControl<string | null>;
  registration: FormControl<string | null>;
  company: FormControl<boolean | null>;
}

interface CarDocForm {
  id: FormControl<number | null>;
  car: FormControl<number | null>;
  name: FormControl<string | null>;
  expirationDate: FormControl<boolean | null>;
  expire: FormControl<Date | string | null>;
  file: FormControl<File | null>;
}

interface CarSchedule {
  schedules: CarScheduleDay[];
  page: number;
  size: number;
  total: number;
  totalPages: number;
  days: Day[];
}

interface CarScheduleDay {
  id: number;
  carName: string;
  days: {
    [key: string]: CarDay[];
  };
}

interface CarDay {
  id: number | null;
  car: number | null;
  carName?: string | null;
  color: string | null;
  info: string | null;
  startTime: string | Date | null;
  endTime: string | Date | null;
}

interface CarAction {
  carDay: CarDay | null;
  data: Day;
}

interface CarMenuAction {
  action: string;
  data: EmptyDay | CarDay;
}

interface EmptyDay {
  data: Day;
  car: CarScheduleDay;
}

export {
  Car,
  CarDoc,
  CarDocData,
  CarDocForm,
  CarForm,
  CarSchedule,
  CarScheduleDay,
  CarDay,
  EmptyDay,
  CarAction,
  CarMenuAction,
};
