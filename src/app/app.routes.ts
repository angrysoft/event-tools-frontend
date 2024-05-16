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
    ],
  },
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  },
  //FIXME: add page not found
];
