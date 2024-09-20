import { FormControl } from "@angular/forms";

type WorkerDoc = {
  id: number | null;
  name: string | null;
  fileName: string | null;
  workerId: number | null;
  hasExpirationDate: boolean | null;
  expirationDate?: boolean | null;
  expire: Date | null;
};

interface WorkerDocForm {
  id: FormControl<WorkerDoc["id"]>;
  file: FormControl<File | null>;
  expirationDate: FormControl<WorkerDoc["hasExpirationDate"]>;
  name: FormControl<WorkerDoc["name"]>;
  expire: FormControl<WorkerDoc["expire"]>;
  workerId: FormControl<WorkerDoc["workerId"]>;
}

interface WorkerDocData {
  id: number | null;
  name: string | null;
  file: File | null;
  workerId: number | null;
  expirationDate: boolean | null;
  expire: Date | null;
}

export { WorkerDoc, WorkerDocForm, WorkerDocData };
