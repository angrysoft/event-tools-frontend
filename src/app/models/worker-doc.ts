import { FormControl } from "@angular/forms";
import { WorkerId } from "./worker";

type WorkerDoc = {
expired: any;
  id: number | null;
  name: string | null;
  fileName: string | null;
  worker: WorkerId | null;
  hasExpirationDate: boolean | null;
  expirationDate?: boolean | null;
  expire: Date | null;
};

interface WorkerIdFrom {
  id: FormControl<number | null>;
}

interface WorkerDocForm {
  id: FormControl<number | null>;
  file: FormControl<File | null>;
  expirationDate: FormControl<boolean | null>;
  name: FormControl<string | null>;
  expire: FormControl<Date | null>;
  worker: FormControl<number | null>;
}

interface WorkerDocData {
  id: number | null;
  name: string | null;
  file: File | null;
  worker: number | null;
  expirationDate: boolean | null;
  expire: Date | null;
}

export { WorkerDoc, WorkerDocData, WorkerDocForm };
