import { Component, inject, OnDestroy, OnInit, signal } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { ActivatedRoute, Router } from "@angular/router";
import { debounceTime, Subject, takeUntil } from "rxjs";
import { FormBaseComponent } from "../../../../components/form-base/form-base.component";
import { WorkerRatesPipe } from "../../../../pipes/worker-rates.pipe";
import { Addon, AddonGroup } from "../../../models/addon";
import { EventDay } from "../../../models/events";
import { Rate } from "../../../models/rate";
import { RatesService } from "../../../services/rates.service";
import { WorkerDaysService } from "../../../services/worker-days.service";

@Component({
  selector: "app-change-rates",
  standalone: true,
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
  ],
  templateUrl: "./change-rates.component.html",
  styleUrl: "./change-rates.component.scss",
})
export class ChangeRatesComponent implements OnInit, OnDestroy {
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  router = inject(Router);
  service = inject(WorkerDaysService);
  rateSrv = inject(RatesService);

  canSend = signal<boolean>(false);
  rates = signal<Rate[]>([]);
  addons = signal<Addon[]>([]);
  eventDay = signal<EventDay>({
    event: 0,
    info: "",
    startDate: new Date(),
    state: "",
    workerDays: [],
  });

  changeRateForm: FormGroup<ChangeRateForm>;
  addonGroup: FormGroup<AddonGroup>;
  destroy = new Subject();
  formTitle = "Dodaj Pracowników";
  eventId = Number(this.route.snapshot.paramMap.get("eventId"));
  dayId = Number(this.route.snapshot.paramMap.get("dayId"));
  tab = this.route.snapshot.queryParamMap.get("tab") ?? 0;
  backTo = `/admin/events/${this.eventId}/day`;

  constructor() {
    this.changeRateForm = this.fb.group<ChangeRateForm>({
      id: new FormControl(),
      eventDay: new FormControl(this.dayId, Validators.required),
      workers: this.fb.array([], Validators.required),
      workerDayAddons: this.fb.array([]),
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

    let selected: WorkerSelect[] =
      (this.router.getCurrentNavigation()?.extras.state![
        "selected"
      ] as WorkerSelect[]) ?? [];
    if (selected) this.updateWorkerList(selected);
  }

  ngOnInit(): void {
    this.changeRateForm.statusChanges
      .pipe(takeUntil(this.destroy), debounceTime(500))
      .subscribe((status) => {
        this.canSend.set(status === "VALID" && this.changeRateForm.dirty);
      });
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

  get workers() {
    return this.changeRateForm.controls.workers;
  }

  get workerDayAddons() {
    return this.changeRateForm.controls.workerDayAddons.controls;
  }

  addAddon() {
    const addon = this.addons().find((a) => a.id === this.addonGroup.value.id);
    if (
      !addon ||
      (addon.addonType === "VARIABLE_ADDON" &&
        this.addonGroup.value.value === null)
    )
      return;

    if (
      this.changeRateForm.controls.workerDayAddons.value.find(
        (a: any) => a.addon === addon.id,
      )
    )
      return;

    const addonGroup = this.fb.group({
      eventDay: new FormControl(this.eventDay().id),
      worker: new FormControl(-1),
      addon: new FormControl(addon.id, Validators.required),
      value: new FormControl(this.addonGroup.value.value),
      name: new FormControl(addon.name),
      type: new FormControl(addon.addonType),
    });
    this.changeRateForm.controls.workerDayAddons.push(addonGroup);
    this.addonGroup.reset();
  }

  removeAddon(idx: number) {
    this.changeRateForm.controls.workerDayAddons.removeAt(idx);
  }

  removeWorkerAddon(worker: any, idx: number) {
    worker.get("workerDayAddons").removeAt(idx);
    this.changeRateForm.updateValueAndValidity();
    this.changeRateForm.markAsDirty();
  }

  private updateWorkerList(selection: WorkerSelect[]) {
    console.log(selection);
    selection.forEach((workerDay) => {
      this.rateSrv.getWorkerRates(workerDay.worker ?? -1).subscribe((resp) => {
        const ratesId: number[] = [];
        if (resp.ok)
          resp.data.items.forEach((r) => {
            ratesId.push(r.rateId);
          });

        const workerGroup: FormGroup<WorkersRateDay> = this.fb.group({
          id: new FormControl(workerDay.id, Validators.required),
          name: new FormControl(workerDay.workerName),
          rate: new FormControl(workerDay.rate, Validators.required),
          rates: new FormControl(ratesId),
          workerDayAddons: this.fb.array(workerDay.workerDayAddons),
        });
        if (
          !this.changeRateForm.controls.workers.controls.some(
            (wg) => wg.value.id === workerDay.id,
          )
        ) {
          this.changeRateForm.controls.workers.push(workerGroup);
        }
      });
    });
  }

  handleSubmit() {
    if (this.changeRateForm.valid && this.changeRateForm.dirty) {
      const formValues = this.changeRateForm.value;

      console.log(formValues);

      // this.service
      //   .storeEventDay(this.eventId, this.dayId, workersDays)
      //   .subscribe((resp) => {
      //     if (resp.ok) this.router.navigateByUrl(this.backTo);
      //     else {
      //       this.service.showError(resp);
      //     }
      //   });
    }
  }
}

interface ChangeRateForm {
  id: FormControl<number | null>;
  eventDay: FormControl<number | null>;
  workers: FormArray;
  workerDayAddons: FormArray;
}

interface WorkersRateDay {
  id: FormControl<number | null>;
  name: FormControl<string | null>;
  rate: FormControl<number | null>;
  rates: FormControl<number[] | null>;
  workerDayAddons: FormArray;
}

interface WorkerSelect {
  id: number;
  eventDay: number;
  worker: number;
  rate: number;
  workerName: string;
  workerDayAddons: any[];
}
