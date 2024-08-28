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
import { WorkerAccount, WorkerForm } from "../../models/worker-form";
import { WorkerHints } from "../../models/worker-hints";
import { WorkersService } from "../../services/workers.service";

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
  canSend = signal<boolean>(false);
  error = signal<string>("");
  workerAccount: FormGroup<WorkerAccount>;
  workerFrom: FormGroup<WorkerForm>;
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
    this.workerAccount = new FormGroup<WorkerAccount>({
      username: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(3)],
      }),
      password: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(8)],
      }),
      password2: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(8)],
      }),
      authority: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });

    this.workerAccount.disable();

    this.workerFrom = new FormGroup<WorkerForm>({
      firstName: new FormControl("", [
        Validators.required,
        Validators.minLength(3),
      ]),
      secondName: new FormControl("", [Validators.minLength(3)]),
      lastName: new FormControl("", [
        Validators.required,
        Validators.minLength(3),
      ]),
      phone: new FormControl("", [
        Validators.required,
        Validators.minLength(9),
      ]),
      email: new FormControl("", [Validators.required, Validators.email]),
      nickname: new FormControl(""),
      color: new FormControl(null),
      teamId: new FormControl(null, [Validators.required]),
      pesel: new FormControl("", [
        Validators.minLength(12),
        Validators.maxLength(12),
        Validators.pattern(/\d{12}/),
      ]), // custom pesel validation
      docNumber: new FormControl("", [
        Validators.minLength(9),
        Validators.maxLength(9),
        Validators.pattern(/^[A-z]{3}\d{6}/),
      ]),
      groupId: new FormControl(null, [Validators.required]),
      createAccount: new FormControl(false),
      user: this.workerAccount,
    });

    effect(() => {
      if (this.workerId() >= 0) {
        this.workerService.getWorker(this.workerId()).subscribe((response) => {
          if (response.ok) {
            this.workerFrom.patchValue(response.data);
            this.workerFrom.controls.createAccount.setValue(
              response.data.hasAccount,
            );
            this.toggleAccount();
            this.update = true;
          }
        });
      }
    });
  }

  ngOnInit(): void {
    this.workerService.getWorkersHints().subscribe((response) => {
      if (response.ok) {
        this.hints = response.data;
      }
    });
    this.workerFrom.events.subscribe((formEvents) => {
      if (formEvents instanceof StatusChangeEvent) {
        this.canSend.set(formEvents.status === "VALID");
      }
    });
  }

  toggleAccount() {
    if (this.workerFrom.controls.createAccount.value) {
      this.workerAccount.enable();
      this.workerAccount.updateValueAndValidity();
    } else this.workerAccount.disable();
  }

  showMsg(msg: string, action: string) {
    this.snackBar.open(msg, action, { duration: 5000 });
  }

  handleSubmit() {
    this.error.set("");
    console.log(this.workerFrom.value);

    if (this.workerFrom.valid) {
      if (this.update) {
        this.updateWorker();
      } else {
        this.addWorker();
      }
      console.log("Form is valid");
    }
  }

  updateWorker() {
    this.workerService
      .updateWorker({ ...this.workerFrom.value, id: this.workerId() })
      .subscribe((response) => {
        console.log(response);
        if (response.ok) {
          this.router.navigateByUrl("/workers/" + this.workerId());
        } else {
          this.showMsg(response.data ?? "Coś poszło nie tak", "Zamknij");
        }
      });
  }
  addWorker() {
    console.log("add");
    this.workerService
      .addWorker(this.workerFrom.value)
      .subscribe((response) => {
        console.log("res: ", response);
        if (response.ok) {
          this.router.navigateByUrl("/workers/" + response.data);
          // this.onSuccess("Dodano uzytkownika", "Powrót");
        } else {
          this.error.set(response.error ?? "Cos Poszło nie tak..");
        }
      });
  }
}
