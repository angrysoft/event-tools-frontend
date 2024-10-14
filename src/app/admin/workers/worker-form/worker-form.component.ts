import {
  Component,
  effect,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
  untracked,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
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
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { debounceTime, Subject, takeUntil } from "rxjs";
import { FormBaseComponent } from "../../../components/form-base/form-base.component";
import { WorkerAccount, WorkerForm } from "../../models/worker-form";
import { WorkerHints } from "../../models/worker-hints";
import { WorkersService } from "../../services/workers.service";
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
    FormBaseComponent,
  ],
  templateUrl: "./worker-form.component.html",
  styleUrl: "./worker-form.component.scss",
})
export class WorkerFormComponent implements OnInit, OnDestroy {
  readonly route = inject(ActivatedRoute);
  update: boolean = false;
  hasAccount: boolean = false;
  backTo = signal<string>("/admin/workers");
  canSend = signal<boolean>(false);
  passwordCheck = signal<boolean>(false);
  error = signal<string>("");
  workerAccount: FormGroup<WorkerAccount>;
  workerForm: FormGroup<WorkerForm>;
  workerId = signal<number>(-1);
  formTitle = input<string>("Dane Pracownika");
  private readonly destroy = new Subject();

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
        password: new FormControl(null, Validators.required),
        password2: new FormControl(null, Validators.required),
        authority: new FormControl("", {
          nonNullable: true,
          validators: [Validators.required],
        }),
      },
      {
        validators: [passwordValidator()],
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
      phone: new FormControl(null, [
        Validators.maxLength(9),
        Validators.pattern(/\d{9}/),
      ]),
      phoneIce: new FormControl(null, [
        Validators.maxLength(9),
        Validators.pattern(/\d{9}/),
      ]),
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

    const paramWorkerId = this.route.snapshot.paramMap.get("workerId");
    if (paramWorkerId) {
      this.backTo.set(`/admin/workers/${paramWorkerId}`);
      this.workerId.set(Number(paramWorkerId));
    }

    effect(() => {
      const wId = this.workerId();

      untracked(() => {
        if (wId >= 0) {
          this.workerService.get(wId).subscribe((response) => {
            console.log(response.data);
            if (response.ok) {
              this.workerForm.patchValue(response.data);
              this.update = true;
              this.hasAccount = response.data.hasAccount ?? false;
            }
          });
        }
      });
    });
  }

  ngOnInit(): void {
    this.workerService.getWorkersHints().subscribe((response) => {
      if (response.ok) {
        this.hints = response.data;
      }
    });
    this.workerForm.statusChanges
      .pipe(takeUntil(this.destroy))
      .subscribe((formEvents) => {
        this.canSend.set(formEvents === "VALID" && this.workerForm.dirty);
      });

    this.workerForm.controls.phone.valueChanges
      .pipe(debounceTime(500), takeUntil(this.destroy))
      .subscribe((val) => {
        if (typeof val === "string") {
          this.workerForm.controls.phone.setValue(
            val?.replace(/[\W_a-zA-Z]+/g, ""),
            { emitEvent: false },
          );
        }
      });
    this.workerForm.controls.phoneIce.valueChanges
      .pipe(debounceTime(500), takeUntil(this.destroy))
      .subscribe((val) => {
        if (typeof val === "string") {
          this.workerForm.controls.phoneIce.setValue(
            val?.replace(/[\W_a-zA-Z]+/g, ""),
            { emitEvent: false },
          );
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
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
    this.workerAccount.reset();
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
      .update(this.workerId(), {
        ...this.workerForm.value,
        id: this.workerId(),
      })
      .subscribe((response) => {
        if (response.ok) {
          this.router.navigateByUrl("/admin/workers/" + this.workerId(), {
            replaceUrl: true,
          });
        } else {
          this.showMsg(response.data ?? "Coś poszło nie tak", "Zamknij");
        }
      });
  }

  addWorker() {
    this.workerService.create(this.workerForm.value).subscribe((response) => {
      if (response.ok) {
        this.router.navigateByUrl("/admin/workers/" + response.data, {
          replaceUrl: true,
        });
      } else {
        this.workerForm.controls.firstName.setErrors({ exists: true });
        this.error.set(response.error ?? "Cos Poszło nie tak...");
      }
    });
  }
}
