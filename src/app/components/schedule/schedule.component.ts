import { DatePipe } from "@angular/common";
import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  inject,
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
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { debounceTime, Subject, takeUntil } from "rxjs";
import { WorkerDaysService } from "../../admin/services/worker-days.service";
import { Schedule, ScheduleAction } from "../../models/schedule";
import { dateToString } from "../../utils/date";
import { LoaderComponent } from "../loader/loader.component";

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
  ],
  templateUrl: "./schedule.component.html",
  styleUrl: "./schedule.component.scss",
})
export class ScheduleComponent implements OnDestroy {
  private readonly service = inject(WorkerDaysService);

  schedules = signal<Schedule>({
    workerSchedules: [],
    count: 0,
    offset: 0,
    size: 0,
    days: [],
    total: 0,
  });
  loading = signal<boolean>(true);
  action = output<ScheduleAction>();
  currentDate = signal<Date>(new Date());
  dateFrom: FormGroup<DateForm>;
  offset: number;
  size: number;
  destroy = new Subject();

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
        if (date) this.loadData();
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

  loadData() {
    this.loading.set(true);
    this.service
      .getSchedule(this.size, this.offset, dateToString(this.currentDate()))
      .subscribe((resp) => {
        if (resp.ok) {
          if (this.offset === 0) this.schedules.set(resp.data);
          else
            this.schedules.update((s) => {
              s.offset = resp.data.offset;
              s.size = resp.data.size;
              s.workerSchedules = s.workerSchedules.concat(
                resp.data.workerSchedules,
              );
              return s;
            });
          this.offset = resp.data.offset;
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
    return this.schedules()?.workerSchedules ?? [];
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

  loadMore() {
    const newOffset = this.offset + this.size;
    if (newOffset > this.schedules().total) return;
    this.offset = newOffset;
    this.loadData();
  }

  onScroll(ev: Event) {
    const el = ev.target as HTMLDivElement;
    const scrollTarget = el.scrollHeight - el.clientHeight;
    if (scrollTarget === el.scrollTop) this.loadMore();
  }
}

interface DateForm {
  month: FormControl<number | null>;
  year: FormControl<number | null>;
}
