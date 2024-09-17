import { Routes } from "@angular/router";
import { authGuard, isAdmin } from "./auth.guard";

export const routes: Routes = [
  {
    path: "login",
    loadComponent: () =>
      import("./login/login.component").then((m) => m.LoginComponent),
    title: "Login",
  },
  {
    path: "admin",
    canActivate: [isAdmin],
    loadComponent: () =>
      import("./admin/admin.component").then((m) => m.AdminComponent),
    title: "Event Tools",
    children: [
      {
        path: "workers",
        title: "Pracownicy",
        loadComponent: () =>
          import("./admin/workers/workers/workers.component").then(
            (m) => m.WorkersComponent,
          ),
      },
      {
        path: "workers/add",
        title: "Dodaj Pracownika",
        loadComponent: () =>
          import("./admin/workers/add-worker/add-worker.component").then(
            (m) => m.AddWorkerComponent,
          ),
      },
      {
        path: "workers/edit/:id",
        title: "Zmień Dane Pracownika",
        loadComponent: () =>
          import("./admin/workers/edit-worker/edit-worker.component").then(
            (m) => m.EditWorkerComponent,
          ),
      },
      {
        path: "workers/:id",
        title: "Dane Pracownika",
        loadComponent: () =>
          import("./admin/workers/show-worker/show-worker.component").then(
            (m) => m.ShowWorkerComponent,
          ),
      },
      {
        path: "settings/groups",
        title: "Grupy",
        loadComponent: () =>
          import("./admin/settings/groups/groups.component").then(
            (m) => m.GroupsComponent,
          ),
      },
      {
        path: "settings/teams",
        title: "Ekipa",
        loadComponent: () =>
          import("./admin/settings/teams/teams.component").then(
            (m) => m.TeamsComponent,
          ),
      },
    ],
  },
  {
    path: "worker",
    canActivate: [authGuard],
    title: "Event Tools",
    loadComponent: () =>
      import("./worker/worker.component").then((m) => m.WorkerComponent),
  },
  {
    path: "accessDenied",
    title: "Zabroniono",
    loadComponent: () =>
      import("./access-denied/access-denied.component").then(
        (m) => m.AccessDeniedComponent,
      ),
  },
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  },
  //FIXME: add page not found
];
