import { DatePipe } from "@angular/common";
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  output,
  signal,
  viewChild,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "../../components/confirm-dialog/confirm-dialog.component";
import { DateChangerComponent } from "../../components/date-changer/date-changer.component";
import { DuplicateDaysComponent } from "../../components/events/duplicate-days/duplicate-days.component";
import { LoaderComponent } from "../../components/loader/loader.component";
import { CarDay, CarMenuAction, CarSchedule } from "../../models/car";
import { ScheduleAction, WorkerDaySchedule } from "../../models/schedule";
import { getTextColor } from "../../utils/colors";
import { CarsService } from "../services/cars.service";
import { CarDayComponent } from "./car-day/car-day.component";
import { EmptyCarDayComponent } from "./empty-car-day/empty-car-day.component";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-car-schedule",
  imports: [
    LoaderComponent,
    DateChangerComponent,
    DatePipe,
    EmptyCarDayComponent,
    CarDayComponent,
    RouterLink,
  ],
  templateUrl: "./car-schedule.component.html",
  styleUrl: "./car-schedule.component.scss",
})
export class CarScheduleComponent implements AfterViewInit, OnDestroy {
  private readonly carService = inject(CarsService);
  private readonly dialog = inject(MatDialog);
  observer!: IntersectionObserver;

  schedules = signal<CarSchedule>({
    schedules: [],
    page: 0,
    size: 0,
    total: 0,
    totalPages: 0,
    days: [],
  });

  loading = signal<boolean>(true);
  action = output<ScheduleAction>();
  page: number = 0;
  size: number = 30;
  readonly end = viewChild.required<ElementRef<HTMLDivElement>>("end");
  currentDate: string = "";

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
    this.end().nativeElement.style.display = "none";
    this.observer.observe(this.end().nativeElement);
  }

  ngOnDestroy(): void {
    this.observer.disconnect();
  }

  reloadData() {
    let size = this.size;
    if (this.page > 0) {
      size = this.schedules().schedules.length;
      this.page = size - this.size;
    }
    this.loadData(size, 0);
  }

  loadData(size: number, page: number) {
    this.loading.set(true);
   
    this.carService
      .getSchedule(size, page, this.currentDate)
      .subscribe((resp) => {
        if (resp.ok) {
          this.schedules.set(resp.data);
          this.schedules().size = this.size;
          this.loading.set(false);
          this.end().nativeElement.style.gridColumn = `1 / span ${
            this.header.length + 1
          }`;
          this.end().nativeElement.style.display = "block";
        }
      });
  }

  loadMore() {
    const newPage = this.page + 1;
    if (newPage > this.schedules().totalPages) return;
    
    this.end().nativeElement.style.display = "none";
    this.page = newPage;
    this.carService
      .getSchedule(this.size, this.page, this.currentDate)
      .subscribe((resp) => {
        if (resp.ok) {
          this.schedules().schedules.push(...resp.data.schedules);
          this.schedules().total = resp.data.total;
          this.schedules().totalPages = resp.data.totalPages;
          this.loading.set(false);
        }
        this.end().nativeElement.style.display = "block";
      });
  }

  getTrackOf(item: CarDay) {
    return `${item.car}-${item.startTime}-${item.endTime}`;
  }

  get header() {
    return [
      "carName",
      ...(this.schedules()?.days.map((el) => el.day.toString()) ?? []),
    ];
  }

  get days() {
    return this.schedules()?.days ?? [];
  }

  get cssCols() {
    return `repeat(${this.header.length + 1}, auto)`;
  }

  get rows() {
    return this.schedules().schedules;
  }

  dateChange(date: string) {
    this.currentDate = date;
    this.page = 0;
    this.loadData(this.size, this.page);
  }

  goToCar(id: number) {
    this.action.emit({ action: "worker", data: { workerId: id } });
  }

  removeDay(data: CarDay) {
    console.log(data);
    const delDialog = this.dialog.open(ConfirmDialogComponent, {
      data: { msg: "Czy na pewno chcesz usunąć" },
    });

    delDialog.afterClosed().subscribe((result) => {
      if (result && result === true) {
        this.loading.set(true);

        // this.carService
        //   .removeWorkersDays(data.eventId, data.eventDay, [data.id])
        //   .subscribe((resp) => {
        //     if (resp.ok) {
        //       this.reloadData();
        //     }
        //   });
      }
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

      // const payload = {
      //   from: dateToString(result.start),
      //   to: dateToString(result.end),
      //   workerDays: [data.id],
      // };

      // this.carService
      //   .duplicateDays(data.eventId, data.eventDay, payload)
      //   .subscribe((resp) => {
      //     if (resp.ok) {
      //       this.reloadData();
      //     } else this.carService.showError(resp);
      //     this.loading.set(false);
      //   });
    });
  }

  getTextColor(color: string) {
    return getTextColor(color);
  }

  carDayAction(menuData: CarMenuAction) {
    console.log(menuData)
    switch (menuData.action) {
      case "duplicate":
        // this.duplicateDay(menuData.data as WorkerDaySchedule);
        break;
      case "remove":
        // this.removeDay(menuData.data as WorkerDaySchedule);
        break;
      case "changeWorker":
        // this.changeWorker(menuData.data as WorkerDaySchedule);
        break;
      case "goto":
      // this.action.emit({
      //   action: "event",
      //   data: menuData.data as WorkerDaySchedule | { workerId: number },
      // });
    }
  }

  emptyDayAction(menuData: { action: string }) {
    console.log(menuData);
    // if (menuData.action === "addDayOff") {
    //   const data = menuData.data as WorkerAction;
    //   this.addDayOff(data.worker, data.data);
    // }
  }
}
