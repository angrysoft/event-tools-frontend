import { Routes } from "@angular/router";
import { authGuard } from "./auth.guard";

export const routes: Routes = [
  {
    path: "login",
    loadComponent: () =>
      import("./login/login.component").then((m) => m.LoginComponent),
    title: "Login",
  },
  {
    path: "",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./main/main.component").then((m) => m.MainComponent),
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
        path: "workers/edit/",
        title: "Dodaj Pracownika",
        loadComponent: () =>
          import("./workers-actions/edit-worker/edit-worker.component").then(
            (m) => m.EditWorkerComponent,
          ),
      },
      {
        path: "workers/{id}",
        title: "Dodaj Pracownika",
        loadComponent: () =>
          import("./workers-actions/show-worker/show-worker.component").then(
            (m) => m.ShowWorkerComponent,
          ),
      },
    ],
  },
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  },
  //FIXME: add page not found
];
