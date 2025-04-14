import { SelectionModel } from "@angular/cdk/collections";
import { Component, inject, signal } from "@angular/core";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDivider } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { ActivatedRoute, Router } from "@angular/router";
import { RatesService } from "../../../admin/services/rates.service";
import { Addon, AddonGroup } from "../../../models/addon";
import { EventDay, WorkersRateDay } from "../../../models/events";
import { Rate } from "../../../models/rate";
import { WorkerRatesPipe } from "../../../pipes/worker-rates.pipe";
import { WorkerDaysService } from "../../../services/worker-days.service";
import { FormBaseComponent } from "../../form-base/form-base.component";
import { WorkerDayAddonsComponent } from "../../worker-day-addons/worker-day-addons.component";

@Component({
  selector: "app-change-rates",
  imports: [
    FormBaseComponent,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatCardModule,
    MatSelectModule,
    MatIconModule,
    WorkerRatesPipe,
    MatChipsModule,
    MatDivider,
    MatCheckboxModule,
    WorkerDayAddonsComponent,
  ],
  templateUrl: "./change-rates.component.html",
  styleUrl: "./change-rates.component.scss",
})
export class ChangeRatesComponent {
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  router = inject(Router);
  service = inject(WorkerDaysService);
  rateSrv = inject(RatesService);
  showAmount = true;
  rates = signal<Rate[]>([]);
  addons = signal<Addon[]>([]);
  eventDay = signal<EventDay>({
    event: 0,
    info: "",
    startDate: new Date(),
    state: "",
    workerDays: [],
  });

  workerSelection = new SelectionModel<AbstractControl>(true, []);

  changeRateForm: FormGroup<ChangeRateForm>;
  addonGroup: FormGroup<AddonGroup>;
  formTitle = "Stawki / Dodatki";
  eventId = Number(this.route.snapshot.paramMap.get("eventId"));
  dayId = Number(this.route.snapshot.paramMap.get("dayId"));
  tab = this.route.snapshot.queryParamMap.get("tab") ?? 0;
  backTo = `/admin/events/${this.eventId}/day`;

  constructor() {
    this.changeRateForm = this.fb.group<ChangeRateForm>({
      workers: this.fb.array([], Validators.required),
    });

    this.service.getRates().subscribe((resp) => {
      if (resp.ok) this.rates.set(resp.data.items);
    });

    this.service.getAddons().subscribe((resp) => {
      if (resp.ok) this.addons.set(resp.data.items);
    });

    this.addonGroup = this.fb.group({
      id: new FormControl(),
      value: new FormControl(),
    });

    const selected: WorkerSelect[] =
      (this.router.getCurrentNavigation()?.extras.state![
        "selected"
      ] as WorkerSelect[]) ?? [];
    if (selected) this.updateWorkerList(selected);

    const backTo = this.router.getCurrentNavigation()?.extras.state!["backTo"];
    if (backTo) this.backTo = backTo;

    const showAmount =
      this.router.getCurrentNavigation()?.extras.state!["showAmount"];
    if (showAmount !== undefined) this.showAmount = showAmount;
  }

  get workers() {
    return this.changeRateForm.controls.workers;
  }

  getAddonType(addon: number): string {
    return (
      this.addons()
        .filter((a) => a.id === addon)
        .at(0)?.addonType ?? ""
    );
  }

  isSelectedAll(): boolean {
    return this.workerSelection.selected.length === this.workers.length;
  }

  toggleAllRows() {
    if (this.isSelectedAll()) {
      this.workerSelection.clear();
    } else {
      this.workerSelection.select(...this.workers.controls);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  removeWorkerAddon(worker: any, idx: number) {
    worker.get("workerDayAddons").removeAt(idx);
    this.addonsChanged();
  }

  private updateWorkerList(selection: WorkerSelect[]) {
    selection.forEach((workerDay) => {
      this.rateSrv
        .getWorkerAssignedRateValues(workerDay.worker ?? -1)
        .subscribe((resp) => {
          const ratesId: number[] = [];
          if (resp.ok)
            resp.data.forEach((r) => {
              ratesId.push(r.rateId);
            });

          const workerGroup: FormGroup<WorkersRateDay> = this.fb.group({
            workerDay: new FormControl(workerDay.id, Validators.required),
            workerName: new FormControl(workerDay.workerName),
            worker: new FormControl(workerDay.worker, Validators.required),
            rate: new FormControl(workerDay.rate, Validators.required),
            rates: new FormControl(ratesId),
            workerDayAddons: this.fb.array(workerDay.workerDayAddons),
          });
          if (
            !this.changeRateForm.controls.workers.controls.some(
              (wg) => wg.value.id === workerDay.id
            )
          ) {
            this.changeRateForm.controls.workers.push(workerGroup);
          }
        });
    });
  }

  addonsChanged() {
    this.changeRateForm.markAsDirty();
    this.changeRateForm.updateValueAndValidity();
  }

  handleSubmit() {
    if (this.changeRateForm.valid && this.changeRateForm.dirty) {
      const payload: WorkersRateDay[] = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.changeRateForm.value.workers.forEach((w: any) => {
        payload.push({
          worker: w.worker,
          workerDay: w.workerDay,
          workerDayAddons: w.workerDayAddons,
          workerName: w.workerName,
          rate: w.rate,
          rates: w.rates,
        });
      });
      this.service
        .changeRates(this.eventId, this.dayId, payload)
        .subscribe((resp) => {
          if (resp.ok)
            this.router.navigateByUrl(this.backTo);
          else {
            this.service.showError(resp);
          }
        });
    }
  }
}

interface ChangeRateForm {
  workers: FormArray;
}

interface WorkerSelect {
  id: number;
  eventDay: number;
  worker: number;
  rate: number;
  workerName: string;
  workerDayAddons: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
}
