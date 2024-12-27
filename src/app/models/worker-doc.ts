import { FormControl } from "@angular/forms";
import { WorkerId } from "./worker";

type WorkerDoc = {
  id: number | null;
  name: string | null;
  fileName: string | null;
  worker: WorkerId | null;
  hasExpirationDate: boolean | null;
  expire?: Date | string | null;
};

interface WorkerDocForm {
  id: FormControl<number | null>;
  file: FormControl<File | null>;
  expirationDate: FormControl<boolean | null>;
  name: FormControl<string | null>;
  expire: FormControl<Date | string | null>;
  worker: FormControl<number | null>;
}

interface WorkerDocData {
  id: number | null;
  name: string | null;
  file: File | null;
  worker: number | null;
  expirationDate: boolean | null;
  expire?: Date | string | null;
}

export { WorkerDoc, WorkerDocData, WorkerDocForm };
