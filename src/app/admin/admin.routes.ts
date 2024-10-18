import { Routes } from "@angular/router";
import { settingsRoutes } from "./settings/settings.route";
import { workersRoutes } from "./workers/worker.routes";
import { eventsRoutes } from "./events/events.routes";

export const adminRoutes: Routes = [
  {
    path: "dashboard",
    title: "Dashboard",
    loadComponent: () =>
      import("./dashboard/dashboard.component").then(
        (m) => m.DashboardComponent,
      ),
  },
  ...workersRoutes,
  ...settingsRoutes,
  ...eventsRoutes,
  {
    path: "calendar",
    title: "Kalendarz Imprez",
    loadComponent: () =>
      import("./calendar/calendar.component").then((m) => m.CalendarComponent),
  },
  {
    path: "work-schedule",
    title: "Kalendarz Imprez",
    loadComponent: () =>
      import("./work-schedule/work-schedule.component").then((m) => m.WorkScheduleComponent),
  },
];
