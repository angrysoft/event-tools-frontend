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
      import("./event-days/event-days.component").then(
        (m) => m.EventDaysComponent,
      ),
  },
];
