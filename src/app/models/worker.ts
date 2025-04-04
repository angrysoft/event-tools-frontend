import { FormControl } from "@angular/forms";
import { Car } from "./car";
import { RateValue } from "./rate";
import { WorkerDoc } from "./worker-doc";
import { AddonValue } from "./addon";

interface WorkerId {
  id: number | null;
}

interface WorkerBase {
  id: number | null;
  firstName: string | null;
  lastName: string | null;
  phone?: string | null;
}

interface BasicPay {
  value: number;
  workers: number;
}

interface Worker extends WorkerBase {
  secondName: string | null;
  phone: string | null;
  phoneIce: string | null;
  mother: string | null;
  father: string | null;
  email: string | null;
  nickname: string | null;
  color: string | null;
  username: string | null;
  teamId: number | null;
  groupId: number | null;
  pesel: string | null;
  docNumber: string | null;
  hasAccount: boolean | null;
  password: string | null;
  password2: string | null;
  authority: string | null;
  workerDoc: WorkerDoc[];
  basicPay: BasicPay;
  cars?: Car[];
  rateValues?: RateValue[];
  addonValues?: AddonValue[];
  desc: string | null;
}

interface WorkersItem {
  firstName: string;
  lastName: string;
  id: number;
  group: string;
  team: string;
}

interface OfficeWorkers {
  coordinators: WorkerBase[];
  accountManagers: WorkerBase[];
}

interface WorkerForm {
  firstName: FormControl<string | null>;
  secondName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  mother: FormControl<string | null>;
  father: FormControl<string | null>;
  phone: FormControl<string | null>;
  phoneIce: FormControl<string | null>;
  email: FormControl<string | null>;
  nickname: FormControl<string | null>;
  color: FormControl<string | null>;
  teamId: FormControl<number | null>;
  groupId: FormControl<number | null>;
  pesel: FormControl<string | null>;
  docNumber: FormControl<string | null>;
  hasAccount: FormControl<boolean | null>;
  username: FormControl<string | null>;
  password: FormControl<string | null>;
  password2: FormControl<string | null>;
  authority: FormControl<string | null>;
}

interface WorkerParam {
  pageNumber?: number;
  pageSize?: number;
  query: string;
}
export {
  BasicPay,
  OfficeWorkers,
  Worker,
  WorkerBase,
  WorkerForm,
  WorkerId,
  WorkersItem,
  WorkerParam,
};
