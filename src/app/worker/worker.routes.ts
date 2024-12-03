import { Routes } from "@angular/router";

export const workerRoutes: Routes = [
  {
    path: "calendar",
    title: "Mój Kalendarz",
    loadComponent: () =>
      import("./worker-calendar/worker-calendar.component").then((m) => m.WorkerCalendarComponent),
  },
  {
    path: "work-schedule",
    title: "Grafik",
    loadComponent: () =>
      import("./work-schedule/work-schedule.component").then(
        (m) => m.WorkScheduleComponent
      ),
  },
];
