import { SelectionModel } from "@angular/cdk/collections";
import { Component, inject, OnDestroy, OnInit, signal } from "@angular/core";
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
import { debounceTime, Subject, takeUntil } from "rxjs";
import { Addon, AddonGroup } from "../../admin/models/addon";
import { Rate } from "../../admin/models/rate";
import { RatesService } from "../../admin/services/rates.service";
import { WorkerDaysService } from "../../admin/services/worker-days.service";
import { FormBaseComponent } from "../../components/form-base/form-base.component";
import { WorkerDayAddonsComponent } from "../../components/worker-day-addons/worker-day-addons.component";
import { EventDay, WorkersRateDay } from "../../models/events";
import { WorkerRatesPipe } from "../../pipes/worker-rates.pipe";

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
    styleUrl: "./change-rates.component.scss"
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

  workerSelection = new SelectionModel<AbstractControl>(true, []);

  changeRateForm: FormGroup<ChangeRateForm>;
  addonGroup: FormGroup<AddonGroup>;
  destroy = new Subject();
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

  removeWorkerAddon(worker: any, idx: number) {
    worker.get("workerDayAddons").removeAt(idx);
    this.addonsChanged();
  }

  private updateWorkerList(selection: WorkerSelect[]) {
    selection.forEach((workerDay) => {
      this.rateSrv.getWorkerRates(workerDay.worker ?? -1).subscribe((resp) => {
        const ratesId: number[] = [];
        if (resp.ok)
          resp.data.items.forEach((r) => {
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
            (wg) => wg.value.id === workerDay.id,
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
      this.changeRateForm.value.workers.forEach((w:any) => {
        payload.push({
          worker: w.worker,
          workerDay: w.workerDay,
          workerDayAddons: w.workerDayAddons,
          workerName: w.workerName,
          rate: w.rate,
          rates: w.rates,
        });
      })
      this.service
        .changeRates(
          this.eventId,
          this.dayId,
          payload,
        )
        .subscribe((resp) => {
          if (resp.ok) this.router.navigateByUrl(this.backTo);
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
  workerDayAddons: any[];
}
