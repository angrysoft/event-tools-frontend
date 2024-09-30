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
import { MatOptionModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatInput, MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBaseComponent } from "../../../../components/form-base/form-base.component";
import { Rate, RateValueForm } from "../../../models/rate";
import { RatesService } from "../../../services/rates.service";

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
    MatSelectModule,
  ],
  templateUrl: "./rate-value-form.component.html",
  styleUrl: "./rate-value-form.component.scss",
})
export class RateValueFormComponent implements OnInit {
deleteRateValue() {
throw new Error('Method not implemented.');
}
  readonly breakpointObserver = inject(BreakpointObserver);
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly service = inject(RatesService);
  rateValueId = signal<number>(-1);
  workerId = signal<number>(-1);
  update: boolean = false;
  backTo = signal<string>("/admin/workers/");
  canSend = signal<boolean>(false);
  rateValueForm: FormGroup<RateValueForm>;
  rates = signal<Rate[]>([]);
  showOvertime = signal<boolean>(false);
  showBaseValue = signal<boolean>(false);
  showPerHour = signal<boolean>(false);
  private _snackBar = inject(MatSnackBar);

  constructor() {
    const paramWorkerId = this.route.snapshot.paramMap.get("workerId");
    if (paramWorkerId) this.workerId.set(Number(paramWorkerId));
    const paramRateValueId = this.route.snapshot.paramMap.get("rateValueId");
    if (paramRateValueId) {
      this.rateValueId.set(Number(paramRateValueId));
      this.update = true;
    }

    this.rateValueForm = new FormGroup({
      id: new FormControl(rateValueId());
      workerId: new FormControl(this.workerId()),
      rateId: new FormControl(this.rateId()),
      perHourOvertimeValue: new FormControl({value: 0, disabled:true}, Validators.required),
      perHourValue: new FormControl({value: 0, disabled:true}, Validators.required),
      value: new FormControl({value: 0, disabled:true}, Validators.required),
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
    if (!this.rateValueForm.valid) {
      return;
    }


    if (this.update) this.updateRateValue();
    else this.createRateValue();
  }

  createRateValue() {
    this.service.createRateValue(this.rateValueForm.value).subscribe((resp) => {
      if (resp.ok) this.router.navigateByUrl(this.backTo() + "?tab=2");
      else this.handleError(resp);
    });
  }
  
  updateRateValue() {
    this.service
      .updateRateValue( this.rateValueForm.value)
      .subscribe((resp) => {
        if (resp.ok) this.router.navigateByUrl(this.backTo());
        else this.handleError(resp);
      });
    throw new Error("Method not implemented.");
  }

  verifyRateType() {
    const currentRate = this.rates()
      .filter((el) => el.id === this.rateValueForm.controls.rateId.value)
      .at(0);

    console.log(currentRate);

    switch (currentRate?.rateType) {
      case "HOUR_RATE":
        this.rateValueForm.controls.perHourOvertimeValue.enable();
        this.rateValueForm.controls.perHourValue.enable();
        this.rateValueForm.controls.value.disable();

        break;
      case "BASE_OVERTIME_RATE":
        this.rateValueForm.controls.perHourOvertimeValue.enable();
        this.rateValueForm.controls.perHourValue.disable();
        this.rateValueForm.controls.value.enable();
        break;

      case "CONSTANT_RATE":
        this.rateValueForm.controls.perHourOvertimeValue.disable();
        this.rateValueForm.controls.perHourValue.disable();
        this.rateValueForm.controls.value.enable();
        break;
    }

    this.rateValueForm.updateValueAndValidity();
  }

  handleError(err: any) {
    console.warn(err.error);
    this._snackBar.open(err.data ?? "Coś poszło nie tak...", "Zamknij", {
      verticalPosition: "top",
    });
  }
}
