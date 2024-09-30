import { BreakpointObserver } from "@angular/cdk/layout";
import { AsyncPipe } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatInput, MatInputModule } from "@angular/material/input";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBaseComponent } from "../../../../components/form-base/form-base.component";
import { Rate, RateValueForm } from "../../../models/rate";
import { DocsService } from "../../../services/docs.service";
import { RatesService } from "../../../services/rates.service";
import { MatOptionModule } from "@angular/material/core";

@Component({
  selector: "app-rate-value-form",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormBaseComponent,
    MatCardModule,
    MatLabel,
    MatFormFieldModule,
    MatInputModule,
    MatInput,
    MatDatepickerModule,
    MatIcon,
    MatButtonModule,
    AsyncPipe,
    MatOptionModule,
  ],
  templateUrl: "./rate-value-form.component.html",
  styleUrl: "./rate-value-form.component.scss",
})
export class RateValueFormComponent implements OnInit {
  readonly breakpointObserver = inject(BreakpointObserver);
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly service = inject(RatesService);
  rateId = signal<number>(-1);
  workerId = signal<number>(-1);
  update: boolean = false;
  backTo = signal<string>("/admin/workers/");
  canSend = signal<boolean>(false);
  rateValueForm: FormGroup<RateValueForm>;
  private _snackBar = inject(MatSnackBar);
  rates = signal<Rate[]>([]);
  showOvertime = signal<boolean>(false);
  showBaseValue = signal<boolean>(false);

  constructor() {
    const paramWorkerId = this.route.snapshot.paramMap.get("workerId");
    if (paramWorkerId) this.workerId.set(Number(paramWorkerId));
    const paramRateId = this.route.snapshot.paramMap.get("rateId");
    if (paramRateId) {
      this.rateId.set(Number(paramRateId));
      this.update = true;
    }

    this.rateValueForm = new FormGroup({
      workerId: new FormControl(this.workerId()),
      rateId: new FormControl(this.rateId()),
      perHourOvertimeValue: new FormControl(),
      perHourValue: new FormControl(),
      value: new FormControl(),
    });

    this.service.getAll().subscribe((resp) => {
      if (resp.ok) {
        this.rates.set(resp.data.items);
      }
    });
  }

  ngOnInit(): void {
    this.rateValueForm.statusChanges.subscribe((changeEvent) => {
      this.canSend.set(changeEvent === "VALID" && this.rateValueForm.dirty);
    });
  }

  handleSubmit() {
    throw new Error("Method not implemented.");
  }

  verifyRateType() {
    const currentRate = this.rates()
      .filter((el) => el.id === this.rateValueForm.controls.rateId.value)
      .at(0);

    if (currentRate) {
      this.showOvertime.set(false);
      this.rateValueForm.controls.perHourValue.clearValidators();
      this.rateValueForm.controls.perHourOvertimeValue.clearValidators();
      this.rateValueForm.controls.value.clearValidators();
    }

    switch (currentRate?.rateType) {
      case "HOUR_RATE":
        this.showOvertime.set(true);
        this.rateValueForm.controls.perHourOvertimeValue.addValidators(
          Validators.required,
        );
        this.rateValueForm.controls.perHourValue.addValidators(
          Validators.required,
        );
        this.showBaseValue.set(false);
        this.rateValueForm.controls.value.reset();

        break;
      case "BASE_OVERTIME_RATE":
        this.showOvertime.set(true);
        this.rateValueForm.controls.perHourOvertimeValue.addValidators(
          Validators.required,
        );

        this.showBaseValue.set(true);
        this.rateValueForm.controls.value.addValidators(Validators.required);
        break;

      case "CONSTANT_RATE":
        this.showOvertime.set(false);
        this.rateValueForm.controls.perHourValue.reset();
        this.rateValueForm.controls.perHourOvertimeValue.reset();
        this.showBaseValue.set(true);
        this.rateValueForm.controls.value.addValidators(Validators.required);
        break;
    }
    this.rateValueForm.updateValueAndValidity();
  }
}
