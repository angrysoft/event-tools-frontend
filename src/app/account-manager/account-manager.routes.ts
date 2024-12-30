import { Routes } from "@angular/router";

export const accountManagerRoutes: Routes = [
  {
    path: "calendar",
    title: "Kalendarz Imprez",
    loadComponent: () =>
      import(
        "./account-manager-calendar/account-manager-calendar.component"
      ).then((m) => m.AccountManagerCalendarComponent),
  },
  {
    path: "work-schedule",
    title: "Grafik",
    loadComponent: () =>
      import("./account-manager-schedule/account-manager-schedule.component").then(
        (m) => m.AccountManagerScheduleComponent
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
    path: "reports/event",
    title: "Raporty",
    loadComponent: () =>
      import("../reports/event-report/event-report.component").then(
        (m) => m.EventReportComponent
      ),
    data: {
      api: "/api/account-manager/events",
      actions: "/account-manager/reports/event",
    },
  },
  {
    path: "reports/event/:eventId",
    title: "Raport Imprezy",
    loadComponent: () =>
      import("../reports/event-report-view/event-report-view.component").then(
        (m) => m.EventReportViewComponent
      ),
  },
  {
    path: "reports/workers",
    title: "Raporty Miesięczny",
    loadComponent: () =>
      import("../reports/workers-report/workers-report.component").then(
        (m) => m.WorkersReportComponent
      ),
    data: {
      actions: "/account-manager/reports/workers/view",
      backTo: "/account-manager/reports/workers",
    },
  },
  {
    path: "reports/workers/view",
    title: "Raporty Miesięczny",
    loadComponent: () =>
      import(
        "../reports/workers-report-view/workers-report-view.component"
      ).then((m) => m.WorkersReportViewComponent),
  },
  {
    path: "reports/from-dates",
    title: "Raporty z okresu",
    loadComponent: () =>
      import("../reports/from-dates-report/from-dates-report.component").then(
        (m) => m.FromDatesReportComponent
      ),
    data: {
      actions: "/account-manager/reports/from-dates/view",
      backTo: "/account-manager/reports/from-dates",
    },
  },
  {
    path: "reports/from-dates/view",
    title: "Raporty z okresu",
    loadComponent: () =>
      import(
        "../reports/from-dates-report-view/from-dates-report-view.component"
      ).then((m) => m.FromDatesReportViewComponent),
  },
  {
    path: "reports/plan-execution",
    title: "Raport Plan/Realizacja",
    loadComponent: () =>
      import(
        "../reports/plan-execution-report/plan-execution-report.component"
      ).then((m) => m.PlanExecutionReportComponent),
    data: {
      api: "/api/account-manager/events",
      actions: "/account-manager/reports/plan-execution",
    },
  },
  {
    path: "reports/plan-execution/:eventId",
    title: "Raport Plan/Realizacja",
    loadComponent: () =>
      import(
        "../reports/plan-execution-report-view/plan-execution-report-view.component"
      ).then((m) => m.PlanExecutionReportViewComponent),
  },
];
