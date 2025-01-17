import { SelectionModel } from "@angular/cdk/collections";
import { DatePipe } from "@angular/common";
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  inject,
  OnDestroy,
  output,
  signal,
  viewChild,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { ConfirmDialogComponent } from "../../components/confirm-dialog/confirm-dialog.component";
import { DateChangerComponent } from "../../components/date-changer/date-changer.component";
import { DuplicateDaysComponent } from "../../components/events/duplicate-days/duplicate-days.component";
import { LoaderComponent } from "../../components/loader/loader.component";
import { CarDay, CarMenuAction, CarSchedule, EmptyDay } from "../../models/car";
import { ScheduleAction } from "../../models/schedule";
import { getTextColor } from "../../utils/colors";
import { dateStringFromMonthYear, dateToString } from "../../utils/date";
import { CarsService } from "../services/cars.service";
import { CarDayViewComponent } from "./car-day-view/car-day-view.component";
import { CarDayComponent } from "./car-day/car-day.component";
import { EmptyCarDayComponent } from "./empty-car-day/empty-car-day.component";

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
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  daySelection = new SelectionModel<CarDay>(true, [], true);
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
  initDate: string | null = null;

  constructor() {
    const month = this.route.snapshot.queryParamMap.get("month");
    const year = this.route.snapshot.queryParamMap.get("year");
    if (month && year) {
      this.initDate = dateStringFromMonthYear(Number(month) + 1, Number(year));
    }
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
    this.end().nativeElement.style.display = "none";
    this.observer.observe(this.end().nativeElement);
  }

  ngOnDestroy(): void {
    this.observer.disconnect();
  }

  get isMultipleSelected() {
    return this.daySelection.selected.length > 1;
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
    let msg = "Czy na pewno chcesz usunąć";
    if (this.isMultipleSelected) {
      msg = `Czy na pewno chcesz usunąć zaznaczone (${this.daySelection.selected.length})`;
    }
    const delDialog = this.dialog.open(ConfirmDialogComponent, {
      data: { msg: msg },
    });

    delDialog.afterClosed().subscribe((result) => {
      if (result && result === true) {
        this.loading.set(true);

        if (this.isMultipleSelected) {
          if (this.daySelection.isEmpty()) return;
          console.log(this.daySelection.selected);
          const selectedDays: number[] = this.daySelection.selected.map(
            (d) => d.carDayId
          ) as number[];

          this.carService.removeDayList(selectedDays).subscribe((resp) => {
            if (resp.ok) {
              this.reloadData();
            } else this.carService.showError(resp);
            this.loading.set(false);
          });
        } else {
          if (data.id === null) return;
          this.carService.removeDay(data.id).subscribe((resp) => {
            if (resp.ok) {
              this.reloadData();
            } else this.carService.showError(resp);
            this.loading.set(false);
          });
        }
      }
    });
  }

  duplicateDay(carDay: CarDay) {
    const duplicateDialog = this.dialog.open(DuplicateDaysComponent, {
      data: {
        startTime: carDay.startTime,
      },
      maxWidth: "95vw",
    });
    duplicateDialog.afterClosed().subscribe((result) => {
      if (!result) return;
      this.loading.set(true);

      const payload = {
        from: dateToString(result.start),
        to: dateToString(result.end),
        day: carDay.carDayId ?? null,
      };

      this.carService.duplicateCarDay(payload).subscribe((resp) => {
        if (resp.ok) {
          this.reloadData();
        } else this.carService.showError(resp);
        this.loading.set(false);
      });
    });
  }

  changeCar(carDay: CarDay) {
    console.log("change car: ", carDay);
  }

  getTextColor(color: string) {
    return getTextColor(color);
  }

  carDayAction(menuData: CarMenuAction) {
    switch (menuData.action) {
      case "duplicate":
        this.duplicateDay(menuData.data as CarDay);
        break;
      case "selectDay":
        console.log("select ", menuData.data);
        this.daySelection.toggle(menuData.data as CarDay);
        break;
      case "addDay":
        this.addDay(menuData.data as CarDay);
        break;
      case "remove":
        this.removeDay(menuData.data as CarDay);
        break;
      case "changeCar":
        this.changeCar(menuData.data as CarDay);
        break;
      case "showDay":
        this.showDay(menuData.data as CarDay);
        break;
      case "editDay": {
        this.router.navigateByUrl("/admin/car-schedule/manage", {
          state: {
            day: { ...menuData.data },
          },
        });
        break;
      }
    }
  }

  @HostListener("window.key.esc")
  unselect() {
    this.daySelection.clear();
  }

  showDay(data: CarDay) {
    this.daySelection.clear();
    const dialog = this.dialog.open(CarDayViewComponent, {
      data: { ...data },
    });

    dialog.afterClosed().subscribe((result) => {
      switch (result) {
        case "editDay":
          this.carDayAction({ action: "editDay", data: data });
          break;
        case "removeDay":
          this.removeDay(data);
      }
    });
  }

  addDay(data: CarDay) {
    const startTime = new Date(data.startTime as string);
    startTime.setHours(9);
    startTime.setMinutes(0);
    this.router.navigateByUrl("/admin/car-schedule/manage", {
      state: {
        day: {
          car: data.car,
          carName: data.carName,
          startTime: startTime,
        },
      },
    });
  }

  emptyDayAction(menuData: CarMenuAction) {
    if (menuData.action === "unselect") {
      this.unselect();
    } else if (menuData.action === "addCarDay") {
      const data = menuData.data as EmptyDay;
      this.addDay({
        id: null,
        car: data?.car?.id,
        carName: data.car.carName,
        color: null,
        info: null,
        startTime: data.data.date,
        endTime: null,
      });
    }
  }
}
