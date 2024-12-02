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
        (m) => m.DashboardComponent
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
    title: "Grafik",
    loadComponent: () =>
      import("./work-schedule/work-schedule.component").then(
        (m) => m.WorkScheduleComponent
      ),
  },
  {
    path: "reports/event",
    title: "Raporty",
    loadComponent: () =>
      import("./reports/event-report/event-report.component").then(
        (m) => m.EventReportComponent
      ),
  },
  {
    path: "reports/event/:eventId",
    title: "Raporty Imprezy",
    loadComponent: () =>
      import("./reports/event-report-view/event-report-view.component").then(
        (m) => m.EventReportViewComponent
      ),
  },
  {
    path: "reports/workers",
    title: "Raporty Imprezy",
    loadComponent: () =>
      import("./reports/workers-report/workers-report.component").then(
        (m) => m.WorkersReportComponent
      ),
  },
  {
    path: "reports/workers/view",
    title: "Raporty Miesięczny",
    loadComponent: () =>
      import(
        "./reports/workers-report-view/workers-report-view.component"
      ).then((m) => m.WorkersReportViewComponent),
  },
  {
    path: "reports/from-dates",
    title: "Raporty z okresu",
    loadComponent: () =>
      import("./reports/from-dates-report/from-dates-report.component").then(
        (m) => m.FromDatesReportComponent
      ),
  },
  {
    path: "reports/from-dates/view",
    title: "Raporty z okresu",
    loadComponent: () =>
      import(
        "./reports/from-dates-report-view/from-dates-report-view.component"
      ).then((m) => m.FromDatesReportViewComponent),
  },
  {
    path: "reports/plan-execution",
    title: "Raport Plan/Realizacja",
    loadComponent: () =>
      import(
        "./reports/plan-execution-report/plan-execution-report.component"
      ).then((m) => m.PlanExecutionReportComponent),
  },
  {
    path: "reports/plan-execution/:eventId",
    title: "Raport Plan/Realizacja",
    loadComponent: () =>
      import(
        "./reports/plan-execution-report-view/plan-execution-report-view.component"
      ).then((m) => m.PlanExecutionReportViewComponent),
  },
];
