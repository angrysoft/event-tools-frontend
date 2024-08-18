import { FormControl, FormGroup } from "@angular/forms";

export type WorkerAccount = {
  username: FormControl<string>;
  password: FormControl<string>;
  password2: FormControl<string>;
  authority: FormControl<string>;
};

export type WorkerForm = {
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  phone: FormControl<string | null>;
  email: FormControl<string | null>;
  nickname: FormControl<string | null>;
  color: FormControl<string | null>;
  teamId: FormControl<string | null>;
  groupId: FormControl<string | null>;
  createAccount: FormControl<boolean | null>;
  account?: FormGroup<WorkerAccount>;
};
