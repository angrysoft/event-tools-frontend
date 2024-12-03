import { Routes } from "@angular/router";

export const workerRoutes: Routes = [
  {
    path: "calendar",
    title: "Mój Kalendarz",
    loadComponent: () =>
      import("./calendar/calendar.component").then((m) => m.CalendarComponent),
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
