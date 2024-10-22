import { BreakpointObserver } from "@angular/cdk/layout";
import { AsyncPipe } from "@angular/common";
import {
  Component,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from "@angular/core";
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
import { ActivatedRoute, Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
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
export class RateValueFormComponent implements OnInit, OnDestroy {
  readonly breakpointObserver = inject(BreakpointObserver);
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly service = inject(RatesService);
  rateValueId = signal<number>(-1);
  update = signal<boolean>(false);
  backTo = signal<string>("/admin/workers/");
  canSend = signal<boolean>(false);
  rates = signal<Rate[]>([]);
  rateValueForm: FormGroup<RateValueForm>;
  private readonly destroy = new Subject();

  constructor() {
    this.rateValueForm = new FormGroup<RateValueForm>({
      id: new FormControl(null),
      workerId: new FormControl(null, Validators.required),
      rateId: new FormControl(null, Validators.required),
      perHourOvertimeValue: new FormControl(
        { value: 0, disabled: true },
        Validators.required,
      ),
      perHourValue: new FormControl(
        { value: 0, disabled: true },
        Validators.required,
      ),
      overtimeAddonValue: new FormControl(
        { value: 0, disabled: true },
        Validators.required,
      ),
      value: new FormControl({ value: 0, disabled: true }, Validators.required),
    });

    const paramWorkerId = this.route.snapshot.paramMap.get("workerId");
    if (paramWorkerId) {
      this.rateValueForm.controls.workerId.setValue(Number(paramWorkerId));
      this.backTo.update((back) => back + `${paramWorkerId}`);
    }
    const paramRateValueId = this.route.snapshot.paramMap.get("rateValueId");
    if (paramRateValueId) {
      this.rateValueId.set(Number(paramRateValueId));
      this.service.getRateValue(this.rateValueId()).subscribe((resp) => {
        if (resp.ok) {
          this.rateValueForm.patchValue(resp.data);
          this.update.set(true);
        }
      });
    }

    this.service.getAll().subscribe((resp) => {
      if (resp.ok) {
        this.rates.set(resp.data.items);
      }
    });

    effect(() => {
      if (this.update()) {
        this.verifyRateType();
      }
    });
  }

  ngOnInit(): void {
    this.rateValueForm.statusChanges
      .pipe(takeUntil(this.destroy))
      .subscribe((changeEvent) => {
        this.canSend.set(changeEvent === "VALID" && this.rateValueForm.dirty);
      });
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

  handleSubmit() {
    if (!this.rateValueForm.valid) {
      return;
    }
    console.log(this.rateValueForm.value);
    if (this.update()) this.updateRateValue();
    else this.createRateValue();
  }

  createRateValue() {
    this.service.createRateValue(this.rateValueForm.value).subscribe((resp) => {
      if (resp.ok) this.router.navigateByUrl(this.backTo() + "?tab=3");
      else this.service.showError(resp);
    });
  }

  updateRateValue() {
    if (!this.rateValueId()) {
      return;
    }

    this.service
      .updateRateValue(this.rateValueId(), this.rateValueForm.value)
      .subscribe((resp) => {
        if (resp.ok) this.router.navigateByUrl(this.backTo() + "?tab=3");
        else this.service.showError(resp);
      });
  }

  verifyRateType() {
    const currentRate = this.rates()
      .filter((el) => el.id === this.rateValueForm.controls.rateId.value)
      .at(0);

    switch (currentRate?.rateType) {
      case "HOUR_RATE":
        this.rateValueForm.controls.perHourOvertimeValue.enable();
        this.rateValueForm.controls.perHourValue.enable();
        this.rateValueForm.controls.value.disable();

        break;

      case "BASE_OVERTIME_RATE":
        this.rateValueForm.controls.perHourOvertimeValue.enable();
        this.rateValueForm.controls.overtimeAddonValue.disable();
        this.rateValueForm.controls.perHourValue.disable();
        this.rateValueForm.controls.value.enable();
        break;

      case "BASE_OVERTIME_ADDON":
        this.rateValueForm.controls.value.enable();
        this.rateValueForm.controls.overtimeAddonValue.enable();
        this.rateValueForm.controls.perHourOvertimeValue.disable();
        this.rateValueForm.controls.perHourValue.disable();
        break;

      case "CONSTANT_RATE":
        this.rateValueForm.controls.perHourOvertimeValue.disable();
        this.rateValueForm.controls.perHourValue.disable();
        this.rateValueForm.controls.value.enable();
        break;
    }

    this.rateValueForm.updateValueAndValidity();
  }

  getRateName() {
    return this.rates()
      .filter((el) => el.id === this.rateValueForm.controls.rateId.value)
      .at(0)?.name;
  }
}
