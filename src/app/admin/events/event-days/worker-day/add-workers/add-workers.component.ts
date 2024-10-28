import { DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from "@angular/core";
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
import { provideNativeDateAdapter } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { debounceTime, Subject, takeUntil } from "rxjs";
import { FormBaseComponent } from "../../../../../components/form-base/form-base.component";
import { WorkerDayForm } from "../../../../models/events";
import { ActivatedRoute } from "@angular/router";
import { EventDaysService } from "../../../../services/event-days.service";
import { WorkerBase } from "../../../../models/worker";
import { WorkerChooserComponent } from "../../../../../components/worker-chooser/worker-chooser.component";
import { MatDialog } from "@angular/material/dialog";
import { WorkerChooserConfig } from "../../../../../components/worker-chooser/worker-chooser-config";

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
    DatePipe,
  ],
  templateUrl: "./add-workers.component.html",
  styleUrl: "./add-workers.component.scss",
  providers: [provideNativeDateAdapter()],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddWorkersComponent implements OnInit, OnDestroy {
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  service = inject(EventDaysService);
  dialog = inject(MatDialog);
  addWorkersForm: FormGroup<WorkerDayForm>;
  destroy = new Subject();
  formTitle = "Dodaj Pracowników";
  eventId = this.route.snapshot.paramMap.get("eventId");
  dayId = this.route.snapshot.paramMap.get("dayId");
  backTo = `/admin/events/${this.eventId}/day`;
  canSend = signal<boolean>(false);
  workers = signal<{ id: number; name: string }[]>([]);

  constructor() {
    console.log(this.backTo);
    this.addWorkersForm = this.fb.group<WorkerDayForm>({
      id: new FormControl(),
      eventDay: new FormControl(null, Validators.required),
      rate: new FormControl(),
      startTime: new FormControl(null, Validators.required),
      startHour: new FormControl("09:00"),
      endTime: new FormControl(null, Validators.required),
      endHour: new FormControl("21:00"),
      workers: this.fb.array([]),
      workerDayAddons: this.fb.array([]),
    });

    this.addWorkersForm.controls.startHour.valueChanges
      .pipe(takeUntil(this.destroy), debounceTime(500))
      .subscribe((value) => {
        console.log(value);
      });
    this.addWorkersForm.controls.endHour.valueChanges
      .pipe(takeUntil(this.destroy), debounceTime(500))
      .subscribe((value) => {
        console.log(value);
      });

    this.addWorkersForm.controls.workers.valueChanges
      .pipe(takeUntil(this.destroy), debounceTime(100))
      .subscribe((value: any[]) => {
        this.workers.update((w) => {
          value.forEach((el) => {
            if (!w.some((a) => a.id === el.id)) w.push(el);
          });
          return w;
        });
      });

    effect(() => console.log("efx ", this.workers()));
  }

  ngOnInit(): void {
    this.addWorkersForm.statusChanges
      .pipe(takeUntil(this.destroy))
      .subscribe((status) => {
        this.canSend.set(status === "VALID" && this.addWorkersForm.dirty);
      });
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
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
        result.forEach((worker) => {
          this.addWorkersForm.controls.workers.push(
            new FormGroup({
              id: new FormControl(worker.id),
              name: new FormControl(`${worker.firstName} ${worker.lastName}`),
              rates: new FormControl([1, 2, 3]),
            }),
          );
        });
        // const chief = result.keys().next().value;
        //   this.eventForm.controls.chiefId.setValue(Number(chief?.id));
        //   this.chiefName.set(chief?.firstName + " " + chief?.lastName);
        //   this.eventForm.controls.chiefId.markAsDirty();
        //   this.eventForm.controls.chiefId.updateValueAndValidity();
      }
    });
  }
}
