import { Routes } from "@angular/router";

export const eventsRoutes: Routes = [
  {
    path: "events",
    title: "Imprezy",
    loadComponent: () =>
      import("./events.component").then((m) => m.EventsComponent),
    pathMatch: "full",
  },
  {
    path: "events/add",
    title: "Imprezy",
    loadComponent: () =>
      import("./event-form/event-form.component").then(
        (m) => m.EventFormComponent,
      ),
  },
  {
    path: "events/:eventId",
    title: "Imprezy",
    loadComponent: () =>
      import("./show-event/show-event.component").then(
        (m) => m.ShowEventComponent,
      ),
  },
  {
    path: "events/edit/:eventId",
    title: "Imprezy",
    loadComponent: () =>
      import("./event-form/event-form.component").then(
        (m) => m.EventFormComponent,
      ),
  },
  {
    path: "events/:eventId/day",
    title: "Harmonogram",
    loadComponent: () =>
      import("./admin-event-days/admin-event-days.component").then(
        (m) => m.AdminEventDaysComponent,
      ),
  },
  {
    path: "events/:eventId/day/:dayId",
    title: "Dodaj Pracowników",
    loadComponent: () =>
      import("../../components/events/add-workers/add-workers.component").then(
        (m) => m.AddWorkersComponent,
      ),
  },
  {
    path: "events/:eventId/day/:dayId/change",
    title: "Zmień stawki",
    loadComponent: () =>
      import("../../components/events/change-rates/change-rates.component").then(
        (m) => m.ChangeRatesComponent,
      ),
  },
];
