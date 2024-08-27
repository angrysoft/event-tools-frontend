import { Component, OnInit, effect, input, signal } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  StatusChangeEvent,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatCardModule } from "@angular/material/card";
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
  update = input<boolean>(false);
  canSend = signal<boolean>(false);
  error = signal<string>("");
  workerAccount: FormGroup<WorkerAccount>;
  workerFrom: FormGroup<WorkerForm>;

  formTitle: string = "Dodaj Pracownika";

  hints: WorkerHints = {
    teams: [],
    groups: [],
    authorities: [],
  };

  constructor(
    private formBuilder: FormBuilder,
    private workerService: WorkersService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
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
        validators: [Validators.required, Validators.minLength(8)],
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
      color: new FormControl("", [Validators.required]),
      teamId: new FormControl("", [Validators.required]),
      pesel: new FormControl("", [Validators.minLength(12), Validators.maxLength(12)]), // custom pesel validation
      docNumber: new FormControl("", [Validators.minLength(9), Validators.maxLength(9)]),
      groupId: new FormControl("", [Validators.required]),
      createAccount: new FormControl(false),
      account: this.workerAccount,
    });
    effect(() => console.log(`signal ${this.canSend()}`));
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

  onSuccess(msg: string, action: string) {
    this.snackBar.open(msg, action, { duration: 3000 });
  }

  handleSubmit() {
    this.error.set("");
    console.log(this.workerFrom.value);

    if (this.workerFrom.valid) {
      //FIXME: ....
      if (this.update()) {
        console.log("update");
        this.workerService
          .updateWorker(this.workerFrom.value)
          .subscribe((response) => {
            console.log(response);
            // if (response.ok) {

            // }
          });
      } else {
        console.log("add");
        this.workerService
          .addWorker(this.workerFrom.value)
          .subscribe((response) => {
            console.log("res: ", response);
            if (response.ok) {
              this.onSuccess("Dodano uzytkownika", "Powrót");
              // this.router.navigateByUrl("/workers");
            } else {
              this.error.set(response.error ?? "Cos Poszło nie tak..");
            }
          });
      }
      console.log("Form is valid");
    }
  }
}
