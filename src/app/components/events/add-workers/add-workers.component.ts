import {
  Component,
  inject,
  signal
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { provideNativeDateAdapter } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialog } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { ActivatedRoute, Router } from "@angular/router";
import { RatesService } from "../../../admin/services/rates.service";
import { Addon, AddonGroup } from "../../../models/addon";
import {
  EventDay,
  WorkerAddons,
  WorkerDay,
  WorkerDayForm,
} from "../../../models/events";
import { Rate } from "../../../models/rate";
import { WorkerBase } from "../../../models/worker";
import { WorkerRatesPipe } from "../../../pipes/worker-rates.pipe";
import { WorkerDaysService } from "../../../services/worker-days.service";
import { dateTimeToString } from "../../../utils/date";
import { FormBaseComponent } from "../../form-base/form-base.component";
import { WorkTimeComponent } from "../../work-time/work-time.component";
import { WorkerChooserConfig } from "../../worker-chooser/worker-chooser-config";
import { WorkerChooserComponent } from "../../worker-chooser/worker-chooser.component";

@Component({
  selector: "app-add-workers",
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
    WorkTimeComponent,
  ],
  templateUrl: "./add-workers.component.html",
  styleUrl: "./add-workers.component.scss",
  providers: [provideNativeDateAdapter()],
})
export class AddWorkersComponent {
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  router = inject(Router);
  service = inject(WorkerDaysService);
  rateSrv = inject(RatesService);
  dialog = inject(MatDialog);

  addWorkersForm: FormGroup<WorkerDayForm>;
  addonGroup: FormGroup<AddonGroup>;
  formTitle = "Dodaj Pracowników";
  eventId = Number(this.route.snapshot.paramMap.get("eventId"));
  dayId = Number(this.route.snapshot.paramMap.get("dayId"));
  tab = this.route.snapshot.queryParamMap.get("tab") ?? 0;
  backTo = `/admin/events/${this.eventId}/day`;

  rates = signal<Rate[]>([]);
  addons = signal<Addon[]>([]);
  eventDay = signal<EventDay>({
    event: 0,
    info: "",
    startDate: new Date(),
    state: "",
    workerDays: [],
  });

  constructor() {
    this.addWorkersForm = this.fb.group<WorkerDayForm>({
      id: new FormControl(),
      eventDay: new FormControl(this.dayId, Validators.required),
      rate: new FormControl(),
      startTime: new FormControl(null, Validators.required),
      endTime: new FormControl(null, Validators.required),
      workers: this.fb.array([], Validators.required),
      workerDayAddons: this.fb.array([]),
    });

    this.addonGroup = this.fb.group({
      id: new FormControl(),
      value: new FormControl(),
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state: any = this.router.getCurrentNavigation()?.extras.state;
    let startTime = new Date();

    if (state.startDate) startTime = new Date(state.startDate);
    if (state.backTo) this.backTo = state.backTo;

    startTime.setHours(9);
    startTime.setMinutes(0);

    const endTime = new Date(startTime);
    endTime.setHours(21);
    endTime.setMinutes(0);
    this.addWorkersForm.controls.startTime.setValue(startTime);
    this.addWorkersForm.controls.endTime.setValue(endTime, {
      emitEvent: false,
    });

    this.service.getRates().subscribe((resp) => {
      if (resp.ok) this.rates.set(resp.data.items);
    });

    this.service.getAddons().subscribe((resp) => {
      if (resp.ok) this.addons.set(resp.data.items);
    });
  }

  get workers() {
    return this.addWorkersForm.controls.workers;
  }

  get workerDayAddons() {
    return this.addWorkersForm.controls.workerDayAddons.controls;
  }

  chooseWorkers() {
    const config: WorkerChooserConfig = {
      single: false,
      search: true,
    };

    const dialogRef = this.dialog.open(WorkerChooserComponent, {
      data: config,
    });

    dialogRef.afterClosed().subscribe((result: WorkerBase[] | null) => {
      if (result && result.length > 0) {
        this.updateWorkerList(result);
      }
    });
  }

  private updateWorkerList(workers: WorkerBase[]) {
    workers.forEach((worker) => {
      this.rateSrv
        .getWorkerAssignedRateValues(worker.id ?? -1)
        .subscribe((resp) => {
          const ratesId: number[] = [];
          if (resp.ok)
            resp.data.forEach((r) => {
              ratesId.push(r.rateId);
            });

          const workerGroup = this.fb.group({
            id: new FormControl(worker.id, Validators.required),
            name: new FormControl(`${worker.firstName} ${worker.lastName}`),
            rate: new FormControl(null, Validators.required),
            rates: new FormControl(ratesId),
          });
          if (
            !this.addWorkersForm.controls.workers.controls.some(
              (wg) => wg.value.id === worker.id
            )
          ) {
            this.addWorkersForm.controls.workers.push(workerGroup);
          }
        });
    });
  }

  removeWorker(idx: number) {
    this.addWorkersForm.controls.workers.removeAt(idx);
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
      this.addWorkersForm.controls.workerDayAddons.value.find(
        (a: { addon: number; }) => a.addon === addon.id
      )
    )
      return;

    const addonGroup = this.fb.group({
      worker: new FormControl(-1),
      addon: new FormControl(addon.id, Validators.required),
      value: new FormControl(this.addonGroup.value.value),
      name: new FormControl(addon.name),
      type: new FormControl(addon.addonType),
    });
    this.addWorkersForm.controls.workerDayAddons.push(addonGroup);
    this.addonGroup.reset();
  }

  removeAddon(idx: number) {
    this.addWorkersForm.controls.workerDayAddons.removeAt(idx);
  }

  handleSubmit() {
    if (this.addWorkersForm.valid && this.addWorkersForm.dirty) {
      const workersDays: WorkerDay[] = [];

      const formValues = this.addWorkersForm.value;

      for (const w of formValues.workers) {
        const workerDayAddons: WorkerAddons[] = [];
        formValues.workerDayAddons.forEach((a: WorkerAddons) => {
          workerDayAddons.push({
            ...a,
            worker: w.id,
          });
        });

        const workerDay: WorkerDay = {
          eventDay: this.dayId,
          worker: w.id,
          rate: w.rate,
          workerName: w.name,
          startTime: dateTimeToString(formValues.startTime) ?? "",
          endTime: dateTimeToString(formValues.endTime) ?? "",
          workerDayAddons: workerDayAddons,
        };
        workersDays.push(workerDay);
      }

      this.service
        .storeEventDay(this.eventId, this.dayId, workersDays)
        .subscribe((resp) => {
          if (resp.ok) this.router.navigateByUrl(this.backTo);
          else {
            this.service.showError(resp);
          }
        });
    }
  }
}
