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

interface WorkerDay {}

interface EventDay {
  id?: number;
  event: number;
  info: string;
  startDate: Date;
  state: string;
  workerDays: WorkerDay[];
}

export {
  EventItem,
  EventItemForm,
  EventItemDto,
  EventFile,
  EventDay,
  WorkerDay,
};
