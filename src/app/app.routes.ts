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
    title: "Event Tool",
    children: [
      {
        path: "workers",
        title: "Pracownicy",
        loadComponent: () =>
          import("./workers-actions/workers/workers.component").then(
            (m) => m.WorkersComponent,
          ),
      },
      {
        path: "workers/add",
        title: "Dodaj Pracownika",
        loadComponent: () =>
          import("./workers-actions/add-worker/add-worker.component").then(
            (m) => m.AddWorkerComponent,
          ),
      },
      {
        path: "workers/edit/:id",
        title: "Zmień Dane Pracownika",
        loadComponent: () =>
          import("./workers-actions/edit-worker/edit-worker.component").then(
            (m) => m.EditWorkerComponent,
          ),
      },
      {
        path: "workers/:id",
        title: "Dane Pracownika",
        loadComponent: () =>
          import("./workers-actions/show-worker/show-worker.component").then(
            (m) => m.ShowWorkerComponent,
          ),
      },
    ],
  },
  {
    path: "accessDenied",
    title: "Zabroniono",
    loadComponent: () => import("./access-denied/access-denied.component").then(
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
