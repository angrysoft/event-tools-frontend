import { DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
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
import { provideNativeDateAdapter } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialog } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { ActivatedRoute, Router } from "@angular/router";
import { debounceTime, Subject, takeUntil } from "rxjs";
import { FormBaseComponent } from "../../../../../components/form-base/form-base.component";
import { WorkerChooserConfig } from "../../../../../components/worker-chooser/worker-chooser-config";
import { WorkerChooserComponent } from "../../../../../components/worker-chooser/worker-chooser.component";
import { WorkerRatesPipe } from "../../../../../pipes/worker-rates.pipe";
import { Addon } from "../../../../models/addon";
import { EventDay, WorkerDay, WorkerDayForm } from "../../../../models/events";
import { Rate } from "../../../../models/rate";
import { WorkerBase } from "../../../../models/worker";
import { RatesService } from "../../../../services/rates.service";
import { WorkerDaysService } from "../../../../services/worker-days.service";

@Component({
  selector: "app-add-workers",
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
    DatePipe,
    WorkerRatesPipe,
  ],
  templateUrl: "./add-workers.component.html",
  styleUrl: "./add-workers.component.scss",
  providers: [provideNativeDateAdapter()],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddWorkersComponent implements OnInit, OnDestroy {
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  router = inject(Router);
  service = inject(WorkerDaysService);
  rateSrv = inject(RatesService);
  dialog = inject(MatDialog);

  addWorkersForm: FormGroup<WorkerDayForm>;
  destroy = new Subject();
  formTitle = "Dodaj Pracowników";
  eventId = Number(this.route.snapshot.paramMap.get("eventId"));
  dayId = Number(this.route.snapshot.paramMap.get("dayId"));
  backTo = `/admin/events/${this.eventId}/day`;

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

  constructor() {
    this.addWorkersForm = this.fb.group<WorkerDayForm>({
      id: new FormControl(),
      eventDay: new FormControl(this.dayId, Validators.required),
      rate: new FormControl(),
      startTime: new FormControl(null, Validators.required),
      startHour: new FormControl("09:00"),
      endTime: new FormControl(null, Validators.required),
      endHour: new FormControl("21:00"),
      workers: this.fb.array([], Validators.required),
      workerDayAddons: this.fb.array([]),
    });

    this.service.getEventDay(this.eventId, this.dayId).subscribe((resp) => {
      if (resp.ok) {
        this.addWorkersForm.patchValue(resp.data);
        const startTime = new Date(resp.data.startDate);
        startTime.setHours(9);
        startTime.setMinutes(0);
        const endTime = new Date(resp.data.startDate);
        endTime.setHours(21);
        endTime.setMinutes(0);

        this.addWorkersForm.controls.startTime.setValue(startTime);
        this.addWorkersForm.controls.endTime.setValue(endTime);
        this.eventDay.set(resp.data);
      }
    });

    this.addWorkersForm.controls.startHour.valueChanges
      .pipe(takeUntil(this.destroy), debounceTime(500))
      .subscribe((value) => {
        const t = RegExp(/^(\d+):(\d+)$/).exec(value ?? "");
        if (t?.length === 3) {
          const startTime = new Date(
            this.addWorkersForm.controls.startTime.value?.toString() as string,
          );
          startTime.setHours(Number(t.at(1)));
          startTime.setMinutes(Number(t.at(2)));
          this.addWorkersForm.controls.startTime.setValue(startTime);
        }
      });
    this.addWorkersForm.controls.endHour.valueChanges
      .pipe(takeUntil(this.destroy), debounceTime(500))
      .subscribe((value) => {
        const t = RegExp(/^(\d+):(\d+)$/).exec(value ?? "");
        if (t?.length === 3) {
          const endTime = new Date(
            this.addWorkersForm.controls.endTime.value?.toString() as string,
          );
          endTime.setHours(Number(t.at(1)));
          endTime.setMinutes(Number(t.at(2)));
          this.addWorkersForm.controls.endTime.setValue(endTime);
        }
      });

    this.service.getRates().subscribe((resp) => {
      if (resp.ok) this.rates.set(resp.data.items);
    });

    this.service.getAddons().subscribe((resp) => {
      if (resp.ok) this.addons.set(resp.data.items);
    });
  }

  ngOnInit(): void {
    this.addWorkersForm.statusChanges
      .pipe(takeUntil(this.destroy), debounceTime(500))
      .subscribe((status) => {
        this.canSend.set(status === "VALID" && this.addWorkersForm.dirty);
      });
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

  get workers() {
    return this.addWorkersForm.controls.workers;
  }

  chooseWorkers() {
    const config: WorkerChooserConfig = {
      single: false,
      search: true,
      data: new Set(),
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
      this.rateSrv.getWorkerRates(worker.id ?? -1).subscribe((resp) => {
        const ratesId: number[] = [];
        if (resp.ok)
          resp.data.items.forEach((r) => {
            ratesId.push(r.id);
          });

        const workerGroup = this.fb.group({
          id: new FormControl(worker.id, Validators.required),
          name: new FormControl(`${worker.firstName} ${worker.lastName}`),
          rate: new FormControl(null, Validators.required),
          rates: new FormControl(ratesId),
        });
        if (
          !this.addWorkersForm.controls.workers.controls.some(
            (wg) => wg.value.id === worker.id,
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

  handleSubmit() {
    if (this.addWorkersForm.valid && this.addWorkersForm.dirty) {
      const workersDays: WorkerDay[] = [];
      const formValues = this.addWorkersForm.value;
      formValues.workers.forEach((w: any) => {
        const workerDay: WorkerDay = {
          eventDay: formValues.eventDay,
          worker: w.id,
          rate: w.rate,
          startTime: formValues.startTime ?? "",
          endTime: formValues.endTime ?? "",
          workerDayAddons: formValues.workerDayAddons,
        };
        workersDays.push(workerDay);
      });
      
      if (formValues?.endTime && formValues.startTime)
        console.log(formValues.endTime > formValues.startTime);

      this.service
        .storeEventDay(this.eventId, this.dayId, workersDays)
        .subscribe((resp) => {
          if (resp.ok)
            this.router.navigateByUrl(`/admin/events/${this.eventId}`);
          else {
            this.service.showError(resp);
          }
        });
    }
  }
}
