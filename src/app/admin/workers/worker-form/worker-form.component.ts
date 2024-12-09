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
import { ActivatedRoute, Router } from "@angular/router";
import { debounceTime, Subject, takeUntil } from "rxjs";
import { FormBaseComponent } from "../../../components/form-base/form-base.component";
import { WorkerForm } from "../../../models/worker";
import { WorkerHints } from "../../../models/worker-hints";
import { WorkersService } from "../../../services/workers.service";
import { passwordValidator } from "./passwordValidator";

@Component({
  selector: "app-worker-form",
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

  constructor() {
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
      email: new FormControl("", [Validators.email]),
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

      username: new FormControl({ value: null, disabled: true }, [
        Validators.required,
        Validators.minLength(3),
      ]),
      password: new FormControl({ value: null, disabled: true }, [
        Validators.required,
        Validators.minLength(8),
      ]),
      password2: new FormControl({ value: null, disabled: true }, [
        Validators.required,
        Validators.minLength(8),
      ]),
      authority: new FormControl({ value: null, disabled: true }, [
        Validators.required,
      ]),
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
            { emitEvent: false }
          );
        }
      });
    this.workerForm.controls.phoneIce.valueChanges
      .pipe(debounceTime(500), takeUntil(this.destroy))
      .subscribe((val) => {
        if (typeof val === "string") {
          this.workerForm.controls.phoneIce.setValue(
            val?.replace(/[\W_a-zA-Z]+/g, ""),
            { emitEvent: false }
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
    this.workerForm.controls.username.enable();
    this.workerForm.controls.password.enable();
    this.workerForm.controls.password2.enable();
    this.workerForm.controls.authority.enable();
    this.workerForm.addValidators(passwordValidator());
    // this.passwordCheck.set(checkPasswords);
    this.workerForm.updateValueAndValidity();
  }

  disableAccount() {
    this.workerForm.controls.username.disable();
    this.workerForm.controls.username.reset();
    this.workerForm.controls.password.disable();
    this.workerForm.controls.password.reset();
    this.workerForm.controls.password2.disable();
    this.workerForm.controls.password2.reset();
    this.workerForm.controls.authority.disable();
    this.workerForm.controls.authority.reset();
    this.workerForm.removeValidators(passwordValidator);
    // this.workerAccount.markAsPristine();
    this.workerForm.updateValueAndValidity();
  }

  setAccountToDelete() {
    this.workerForm.controls.hasAccount.setValue(false);
    this.workerForm.markAsDirty();
    this.workerForm.updateValueAndValidity();
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
          this.workerService.showError(response);
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
        this.workerService.showError(response);
        this.error.set(response.error ?? "Cos Poszło nie tak...");
      }
    });
  }
}
