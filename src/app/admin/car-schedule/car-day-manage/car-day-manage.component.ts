import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBaseComponent } from "../../../components/form-base/form-base.component";
import { WorkTimeComponent } from "../../../components/work-time/work-time.component";
import { CarDay } from "../../../models/car";
import { dateTimeToString } from "../../../utils/date";
import { CarsService } from "../../services/cars.service";

@Component({
  selector: "app-car-day-manage",
  imports: [
    FormBaseComponent,
    MatCardModule,
    WorkTimeComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: "./car-day-manage.component.html",
  styleUrl: "./car-day-manage.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarDayManageComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  service = inject(CarsService);
  tab = this.route.snapshot.queryParamMap.get("tab") ?? 0;
  backTo = signal<string>("/admin/car-schedule");
  carDayForm: FormGroup<CarForm>;
  month: number;
  year: number;
  title = signal<string>("Grafik Auta");

  constructor() {
    const currentDate = new Date();
    this.month = currentDate.getMonth();
    this.year = currentDate.getFullYear();
    this.carDayForm = new FormGroup<CarForm>({
      id: new FormControl(null),
      car: new FormControl(null, Validators.required),
      startTime: new FormControl(null, Validators.required),
      endTime: new FormControl(null, Validators.required),
      info: new FormControl(null, Validators.required),
      color: new FormControl(null),
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state: any = this.router.getCurrentNavigation()?.extras.state;
    let data = { ...state.day };
    if (data.carDayId) {
      this.service.getCarDay(state.day.carDayId).subscribe((resp) => {
        if (resp.ok) {
          data = { ...resp.data };
          data.startTime = new Date(resp.data.startTime as string);
          data.endTime = new Date(resp.data.endTime as string);
          this.carDayForm.patchValue(data);
        } else this.service.showError(resp);
      });
    } else {
      data.startTime = new Date(data.startTime);
      data.startTime.setHours(9);
      data.startTime.setMinutes(0);

      data.endTime = new Date(data.startTime);
      data.endTime.setHours(21);
      data.endTime.setMinutes(0);
      data.color = "#fff";
      this.carDayForm.patchValue(data);
    }
    // this.backTo.set(
    //   `/admin/car-schedule?month=${data.startTime.getMonth()}&year=${data.startTime.getFullYear()}`
    // );
  }

  handleSubmit() {
    if (!this.carDayForm.valid) return;
    const values = this.carDayForm.value;
    const payload: CarDay = {
      id: values.id ?? null,
      car: values.car ?? null,
      color: values.color ?? null,
      info: values.info ?? null,
      startTime: dateTimeToString(values.startTime) ?? null,
      endTime: dateTimeToString(values.endTime) ?? null,
    };
    if (payload.id) {
      this.service.updateCarDay(payload).subscribe((resp) => {
        if (resp.ok) this.router.navigateByUrl(this.backTo());
      });
    } else {
      this.service.addCarDay(payload).subscribe((resp) => {
        if (resp.ok) this.router.navigateByUrl(this.backTo());
      });
    }
  }
}

interface CarForm {
  id: FormControl<number | null>;
  car: FormControl<number | null>;
  startTime: FormControl<Date | null>;
  endTime: FormControl<Date | null>;
  info: FormControl<string | null>;
  color: FormControl<string | null>;
}
