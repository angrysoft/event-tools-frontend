import { Routes } from "@angular/router";

export const warehousemanRoutes: Routes = [
  {
    path: "calendar",
    title: "Kalendarz Imprez",
    loadComponent: () =>
      import("./warehouseman-calendar/warehouseman-calendar.component").then((m) => m.WarehousemanCalendarComponent),
  },
  {
    path: "work-schedule",
    title: "Grafik",
    loadComponent: () =>
      import("./warehouseman-schedule/warehouseman-schedule.component").then(
        (m) => m.WarehousemanScheduleComponent
      ),
  },
  {
    path: "car-schedule",
    title: "Grafik Aut",
    loadComponent: () =>
      import("../car-schedule/car-schedule.component").then(
        (m) => m.CarScheduleComponent
      ),
  },
  {
    path: "event/:eventId",
    title: "Dane Imprezy",
    loadComponent: () =>
      import(
        "../components/worker-show-event/worker-show-event.component"
      ).then((m) => m.WorkerShowEventComponent),
  },
  {
    path: "info",
    title: "O mnie",
    loadComponent: () =>
      import("../components/about-me/about-me.component").then(
        (m) => m.AboutMeComponent
      ),
  },
];
