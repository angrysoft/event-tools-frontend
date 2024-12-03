import { Routes } from "@angular/router";
import { authGuard, isAdmin } from "./auth.guard";
import { adminRoutes } from "./admin/admin.routes";
import { workerRoutes } from "./worker/worker.routes";

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
    children: adminRoutes,
  },
  {
    path: "worker",
    canActivate: [authGuard],
    title: "Event Tools",
    loadComponent: () =>
      import("./worker/worker.component").then((m) => m.WorkerComponent),
    children: workerRoutes,
  },
  {
    path: "accessDenied",
    title: "Zabroniono",
    loadComponent: () =>
      import("./access-denied/access-denied.component").then(
        (m) => m.AccessDeniedComponent
      ),
  },
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  },
  //FIXME: add page not found  & root path redirect to login
];
