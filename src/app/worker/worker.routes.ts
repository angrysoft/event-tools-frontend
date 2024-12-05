import { Routes } from "@angular/router";

export const workerRoutes: Routes = [
  {
    path: "calendar",
    title: "Mój Kalendarz",
    loadComponent: () =>
      import("./worker-calendar/worker-calendar.component").then(
        (m) => m.WorkerCalendarComponent
      ),
  },
  {
    path: "work-schedule",
    title: "Grafik",
    loadComponent: () =>
      import("./work-schedule/work-schedule.component").then(
        (m) => m.WorkScheduleComponent
      ),
  },
  {
    path: "event/:eventId",
    title: "Dane Imprezy",
    loadComponent: () =>
      import("./worker-show-event/worker-show-event.component").then(
        (m) => m.WorkerShowEventComponent
      ),
  },
  {
    path: "settlements/chief",
    title: "Kierownika",
    loadComponent: () =>
      import(
        "./settlements/chief-settlements/chief-settlements.component"
      ).then((m) => m.ChiefSettlementsComponent),
  },
  {
    path: "settlements/common",
    title: "Wspólne",
    loadComponent: () =>
      import(
        "./settlements/common-settlements/common-settlements.component"
      ).then((m) => m.CommonSettlementsComponent),
  },
  {
    path: "settlements/manage/:event",
    title: "Rozliczenia",
    loadComponent: () =>
      import(
        "./settlements/manage-settlements/manage-settlements.component"
      ).then((m) => m.ManageSettlementsComponent),
  },
  {
    path: "report",
    title: "Raport",
    loadComponent: () =>
      import("./worker-report/worker-report.component").then(
        (m) => m.WorkerReportComponent
      ),
  },
];
