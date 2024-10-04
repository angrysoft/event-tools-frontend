import { FormControl, FormGroup } from "@angular/forms";

type WorkerAccount = {
  username: FormControl<string | null>;
  password: FormControl<string | null>;
  password2: FormControl<string | null>;
  authority: FormControl<string | null>;
};

type WorkerForm = {
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
  user?: FormGroup<WorkerAccount>;
};

export type { WorkerAccount, WorkerForm };
