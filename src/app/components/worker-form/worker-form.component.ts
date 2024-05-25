import { Component, OnInit, effect, input, signal } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  StatusChangeEvent,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { RouterLink } from "@angular/router";
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
    MatSlideToggleModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatDividerModule,
    RouterLink,
  ],
  templateUrl: "./worker-form.component.html",
  styleUrl: "./worker-form.component.scss",
})
export class WorkerFormComponent implements OnInit {
  update = input<boolean>(false);
  canSend = signal<boolean>(false);

  workerFrom = this.formBuilder.group({
    firstName: new FormControl(""),
    lastName: new FormControl(""),
    phone: new FormControl(""),
    email: new FormControl(""),
    nickname: new FormControl(""),
    color: new FormControl(""),
    createAccount: new FormControl(false),
    username: new FormControl(""),
    password: new FormControl(""),
    password2: new FormControl(""),
    authority: new FormControl(""),
    team: new FormControl(""),
    group: new FormControl(""),
  });
  
  formTitle: string = "Dodaj Pracownika";

  hints: WorkerHints = {
    teams: [],
    groups: [],
    authorities: [],
  };

  constructor(
    private formBuilder: FormBuilder,
    private workerService: WorkersService,
  ) {
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
        console.log(formEvents);
        this.canSend.set(formEvents.status === "VALID");
      }
    });
  }

  handleSubmit() {
    console.log(this.workerFrom.getRawValue());

    if (this.workerFrom.valid) {
      if (this.update.) {
        this.workerService.updateWorker(this.workerFrom.getRawValue());
      }
      console.log("Form is valid");
    }
  }
}
