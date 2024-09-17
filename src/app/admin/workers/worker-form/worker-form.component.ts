import {
  Component,
  OnInit,
  effect,
  inject,
  input,
  signal,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  StatusChangeEvent,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router, RouterLink } from "@angular/router";
import { WorkerAccount, WorkerForm } from "../../../models/worker-form";
import { WorkerHints } from "../../../models/worker-hints";
import { WorkersService } from "../../../services/workers.service";
import { passwordValidator } from "./passwordValidator";

@Component({
  selector: "app-worker-form",
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatCardModule,
    RouterLink,
  ],
  templateUrl: "./worker-form.component.html",
  styleUrl: "./worker-form.component.scss",
})
export class WorkerFormComponent implements OnInit {
  update: boolean = false;
  hasAccount: boolean = false;
  backTo: string = "/admin/workers";
  canSend = signal<boolean>(false);
  passwordCheck = signal<boolean>(false);
  error = signal<string>("");
  workerAccount: FormGroup<WorkerAccount>;
  workerForm: FormGroup<WorkerForm>;
  workerId = input<number>(-1);
  formTitle = input<string>("Dodaj Pracownika");

  hints: WorkerHints = {
    teams: [],
    groups: [],
    authorities: [],
  };

  readonly workerService: WorkersService = inject(WorkersService);
  readonly router: Router = inject(Router);
  readonly snackBar: MatSnackBar = inject(MatSnackBar);

  constructor() {
    this.workerAccount = new FormGroup<WorkerAccount>(
      {
        username: new FormControl("", {
          nonNullable: true,
          validators: [Validators.required, Validators.minLength(3)],
        }),
        password: new FormControl(),
        password2: new FormControl(),
        authority: new FormControl("", {
          nonNullable: true,
          validators: [Validators.required],
        }),
      },
      {
        validators: [passwordValidator],
      },
    );

    this.workerAccount.disable();

    this.workerForm = new FormGroup<WorkerForm>({
      firstName: new FormControl("", [
        Validators.required,
        Validators.minLength(3),
      ]),
      secondName: new FormControl("", [Validators.minLength(3)]),
      lastName: new FormControl("", [
        Validators.required,
        Validators.minLength(3),
      ]),
      mother: new FormControl("", [Validators.minLength(3)]),
      father: new FormControl("", [Validators.minLength(3)]),
      phone: new FormControl("", [
        Validators.required,
        Validators.minLength(9),
      ]),
      phoneIce: new FormControl("", [Validators.minLength(9)]),
      email: new FormControl("", [Validators.required, Validators.email]),
      nickname: new FormControl(""),
      color: new FormControl(null),
      teamId: new FormControl(null, [Validators.required]),
      pesel: new FormControl("", [
        Validators.minLength(11),
        Validators.maxLength(11),
        Validators.pattern(/\d{11}/),
      ]), // custom pesel validation
      docNumber: new FormControl("", [
        Validators.minLength(9),
        Validators.maxLength(9),
        Validators.pattern(/^[A-z]{3}\d{6}/),
      ]),
      groupId: new FormControl(null, [Validators.required]),
      hasAccount: new FormControl(false),
      user: this.workerAccount,
    });

    effect(() => {
      if (this.workerId() >= 0) {
        this.workerService.getWorker(this.workerId()).subscribe((response) => {
          if (response.ok) {
            this.workerForm.patchValue(response.data);
            this.update = true;
            this.hasAccount = response.data.hasAccount ?? false;
            this.backTo = `/admin/workers/${response.data.id}`;
            // if (response.data.hasAccount) this.enableAccount(false);
          }
        });
      }
    });

    effect(() => {
      if (this.passwordCheck()) {
        this.workerAccount.controls.password.setValidators(Validators.required);
        this.workerAccount.controls.password2.setValidators(
          Validators.required,
        );
        this.workerAccount.setValidators(passwordValidator);
      }
    });
  }

  ngOnInit(): void {
    this.workerService.getWorkersHints().subscribe((response) => {
      if (response.ok) {
        this.hints = response.data;
      }
    });
    this.workerForm.events.subscribe((formEvents) => {
      if (formEvents instanceof StatusChangeEvent) {
        this.canSend.set(
          formEvents.status === "VALID" && this.workerForm.dirty,
        );
      }
    });
  }

  toggleAccount() {
    if (this.workerForm.controls.hasAccount.value) this.enableAccount(true);
    else this.disableAccount();
  }

  enableAccount(checkPasswords: boolean) {
    this.workerAccount.enable();
    this.passwordCheck.set(checkPasswords);
    this.workerAccount.updateValueAndValidity();
  }

  disableAccount() {
    this.workerAccount.disable();
    this.workerAccount.markAsPristine();
    this.workerAccount.updateValueAndValidity();
  }

  setAccountToDelete() {
    this.workerForm.controls.hasAccount.setValue(false);
    this.workerForm.markAsDirty();
    this.workerForm.updateValueAndValidity();
  }

  showMsg(msg: string, action: string) {
    this.snackBar.open(msg, action, { duration: 5000 });
  }

  handleSubmit() {
    this.error.set("");
    console.debug(this.workerForm.value);

    if (this.workerForm.valid) {
      if (this.update) {
        this.updateWorker();
      } else {
        this.addWorker();
      }
    }
  }

  updateWorker() {
    this.workerService
      .updateWorker({ ...this.workerForm.value, id: this.workerId() })
      .subscribe((response) => {
        if (response.ok) {
          this.router.navigateByUrl("/admin/workers/" + this.workerId());
        } else {
          this.showMsg(response.data ?? "Coś poszło nie tak", "Zamknij");
        }
      });
  }

  addWorker() {
    this.workerService
      .addWorker(this.workerForm.value)
      .subscribe((response) => {
        if (response.ok) {
          this.router.navigateByUrl("/workers/" + response.data);
          // this.onSuccess("Dodano uzytkownika", "Powrót");
        } else {
          this.error.set(response.error ?? "Cos Poszło nie tak..");
        }
      });
  }
}
