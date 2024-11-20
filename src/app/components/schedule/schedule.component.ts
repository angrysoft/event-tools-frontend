import { CdkContextMenuTrigger, CdkMenu, CdkMenuItem } from "@angular/cdk/menu";
import { DatePipe, JsonPipe } from "@angular/common";
import {
  AfterRenderRef,
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
  signal,
  untracked,
  ViewChild,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { debounceTime, Subject, takeUntil } from "rxjs";
import { DuplicateDaysComponent } from "../../admin/events/event-days/duplicate-days/duplicate-days.component";
import { WorkerDaysService } from "../../admin/services/worker-days.service";
import {
  Schedule,
  ScheduleAction,
  WorkerDaySchedule,
  WorkerSchedule,
} from "../../models/schedule";
import { dateToString } from "../../utils/date";
import { ConfirmDialogComponent } from "../confirm-dialog/confirm-dialog.component";
import { LoaderComponent } from "../loader/loader.component";
import { AddDayOffComponent } from "./add-day-off/add-day-off.component";

@Component({
  selector: "app-schedule",
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    LoaderComponent,
    DatePipe,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    CdkContextMenuTrigger,
    CdkMenu,
    CdkMenuItem,
  ],
  templateUrl: "./schedule.component.html",
  styleUrl: "./schedule.component.scss",
})
export class ScheduleComponent implements OnDestroy, AfterViewInit {
  private readonly workerDayService = inject(WorkerDaysService);
  private readonly dialog = inject(MatDialog);
  observer!: IntersectionObserver;

  schedules = signal<Schedule>({
    workerSchedules: [],
    offset: 0,
    size: 0,
    days: [],
    total: 0,
  });
  admin = input<boolean>(false);
  loading = signal<boolean>(true);
  action = output<ScheduleAction>();
  currentDate = signal<Date>(new Date());
  dateFrom: FormGroup<DateForm>;
  offset: number;
  size: number;
  destroy = new Subject();
  @ViewChild("end") end!: ElementRef<HTMLDivElement>;

  constructor() {
    this.offset = 0;
    this.size = 30;
    this.currentDate().setDate(1);
    this.dateFrom = new FormGroup<DateForm>({
      month: new FormControl(
        this.currentDate().getMonth(),
        Validators.required,
      ),
      year: new FormControl(this.currentDate().getFullYear(), [
        Validators.required,
        Validators.min(2024),
        Validators.minLength(4),
      ]),
    });

    this.dateFrom.statusChanges
      .pipe(debounceTime(500), takeUntil(this.destroy))
      .subscribe((status) => {
        if (status === "VALID") {
          const date = new Date();
          date.setDate(1);
          date.setFullYear(this.dateFrom.controls.year.value ?? 0);
          date.setMonth(this.dateFrom.controls.month.value ?? 0);
          this.offset = 0;
          this.currentDate.set(date);
        }
      });

    effect(() => {
      const date = this.currentDate();
      untracked(() => {
        if (date) this.initialData();
      });
    });
  }

  ngAfterViewInit(): void {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0,
    };
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.loadMore();
        }
      });
    }, options);
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
    this.observer.disconnect();
  }

  initialData() {
    this.offset = 0;
    this.loadData(this.size, this.offset);
  }

  reloadData() {
    let size = this.size;
    if (this.offset > 0) {
      size = this.schedules().workerSchedules.length;
      this.offset = size - this.size;
    }
    this.loadData(size, 0);
  }

  loadData(size: number, offset: number) {
    this.loading.set(true);

    this.workerDayService
      .getSchedule(size, offset, dateToString(this.currentDate()))
      .subscribe((resp) => {
        if (resp.ok) {
          this.observer.disconnect();
          this.schedules.set(resp.data);
          this.schedules().size = this.size;
          this.loading.set(false);
          this.observer.observe(this.end.nativeElement);
          this.end.nativeElement.style.gridColumn = `1 / span ${this.header.length}`;
        }
      });
  }

  loadMore() {
    
    const newOffset = this.offset + this.size;
    if (newOffset > this.schedules().total) return;
    this.offset = newOffset;
    this.workerDayService
      .getSchedule(this.size, this.offset, dateToString(this.currentDate()))
      .subscribe((resp) => {
        if (resp.ok) {
          this.schedules().workerSchedules.push(...resp.data.workerSchedules);
          this.schedules().total = resp.data.total;
          this.loading.set(false);
        }
      });
  }

  get header() {
    return [
      "workerName",
      ...(this.schedules()?.days.map((el) => el.day.toString()) ?? []),
    ];
  }

  get days() {
    return this.schedules()?.days ?? [];
  }

  get cssCols() {
    return `repeat(${this.header.length}, auto)`;
  }

  get rows() {
    return this.schedules().workerSchedules;
  }

  prevMonth() {
    const newDate = new Date(this.currentDate());
    newDate.setMonth(newDate.getMonth() - 1);
    this.dateFrom.controls.month.setValue(newDate.getMonth());
    this.dateFrom.controls.year.setValue(newDate.getFullYear());
  }

  nextMonth() {
    const newDate = new Date(this.currentDate());
    newDate.setMonth(newDate.getMonth() + 1);
    this.dateFrom.controls.month.setValue(newDate.getMonth());
    this.dateFrom.controls.year.setValue(newDate.getFullYear());
  }

  onClick(data: any) {
    this.action.emit({ action: "event", data: data });
  }

  goToWorker(id: number) {
    this.action.emit({ action: "worker", data: { workerId: id } });
  }

  getTextColor(hexcolor: string) {
    if (hexcolor)
      return parseInt(hexcolor.replace("#", ""), 16) > 0xffffff / 2
        ? "black"
        : "white";
    return "inherit";
  }

  removeDay(data: WorkerDaySchedule) {
    const delDialog = this.dialog.open(ConfirmDialogComponent, {
      data: { msg: "Czy na pewno chcesz usunąć" },
    });

    delDialog.afterClosed().subscribe((result) => {
      if (result && result === true) {
        this.loading.set(true);

        this.workerDayService
          .removeWorkersDays(data.eventId, data.eventDay, [data.id])
          .subscribe((resp) => {
            if (resp.ok) {
              this.reloadData();
            }
          });
      }
    });
  }

  addDayOff(worker: any, data: any) {
    const dayOffDialog = this.dialog.open(AddDayOffComponent, {
      data: {
        startDate: data.date,
      },
      maxWidth: "95vw",
    });
    dayOffDialog.afterClosed().subscribe((result) => {
      if (!result) return;
      this.loading.set(true);

      const payload = {
        from: dateToString(result.start),
        to: dateToString(result.end),
        worker: worker.id,
        workerName: worker.workerName,
      };

      this.workerDayService.addDaysOff(payload).subscribe((resp) => {
        if (resp.ok) {
          this.reloadData();
        } else this.workerDayService.showError(resp);
        this.loading.set(false);
      });
    });
  }

  duplicateDay(data: WorkerDaySchedule) {
    const duplicateDialog = this.dialog.open(DuplicateDaysComponent, {
      data: {
        startTime: data.startDate,
      },
      maxWidth: "95vw",
    });
    duplicateDialog.afterClosed().subscribe((result) => {
      if (!result) return;
      this.loading.set(true);

      const payload = {
        from: dateToString(result.start),
        to: dateToString(result.end),
        workerDays: [data.id],
      };

      this.workerDayService
        .duplicateDays(data.eventId, data.eventDay, payload)
        .subscribe((resp) => {
          if (resp.ok) {
            this.reloadData();
          } else this.workerDayService.showError(resp);
          this.loading.set(false);
        });
    });
  }

  removeDayOff(data: any) {
    const delDialog = this.dialog.open(ConfirmDialogComponent, {
      data: { msg: "Czy na pewno chcesz usunąć" },
    });

    delDialog.afterClosed().subscribe((result) => {
      if (result && result === true) {
        this.loading.set(true);
        this.workerDayService.removeDayOff(data.id).subscribe((resp) => {
          if (resp.ok) {
            this.reloadData();
          } else this.workerDayService.showError(resp);
          this.loading.set(false);
        });
      }
    });
  }

  rejectDayOff(data: any) {
    this.loading.set(true);
    this.workerDayService.rejectDayOff(data.id).subscribe((resp) => {
      if (resp.ok) {
        this.reloadData();
      } else this.workerDayService.showError(resp);
      this.loading.set(false);
    });
  }

  acceptDayOff(data: any) {
    this.loading.set(true);
    this.workerDayService.acceptDayOff(data.id).subscribe((resp) => {
      if (resp.ok) {
        this.reloadData();
      } else this.workerDayService.showError(resp);
      this.loading.set(false);
    });
  }
}

interface DateForm {
  month: FormControl<number | null>;
  year: FormControl<number | null>;
}
