import { FormControl, FormGroup } from "@angular/forms";

type WorkerAccount = {
  username: FormControl<string>;
  password: FormControl<string>;
  password2: FormControl<string>;
  authority: FormControl<string>;
};

type WorkerForm = {
  firstName: FormControl<string | null>;
  secondName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  phone: FormControl<string | null>;
  email: FormControl<string | null>;
  nickname: FormControl<string | null>;
  color: FormControl<string | null>;
  teamId: FormControl<number | null>;
  groupId: FormControl<number | null>;
  pesel: FormControl<string | null>;
  docNumber: FormControl<string | null>;
  createAccount: FormControl<boolean | null>;
  user?: FormGroup<WorkerAccount>;
};

export type { WorkerAccount, WorkerForm };
