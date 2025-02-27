import { Routes } from "@angular/router";
import {
  isWorker,
  isAdmin,
  isAccountManager,
  isWarehouseman,
} from "./auth.guard";
import { adminRoutes } from "./admin/admin.routes";
import { workerRoutes } from "./worker/worker.routes";
import { accountManagerRoutes } from "./account-manager/account-manager.routes";
import { warehousemanRoutes } from "./warehouseman/warehouseman.routes";

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
    canActivate: [isWorker],
    title: "Event Tools",
    loadComponent: () =>
      import("./worker/worker.component").then((m) => m.WorkerComponent),
    children: workerRoutes,
  },
  {
    path: "account-manager",
    canActivate: [isAccountManager],
    title: "Event Tools",
    loadComponent: () =>
      import("./account-manager/account-manager.component").then(
        (m) => m.AccountManagerComponent
      ),
    children: accountManagerRoutes,
  },
  {
    path: "warehouseman",
    canActivate: [isWarehouseman],
    title: "Event Tools",
    loadComponent: () =>
      import("./warehouseman/warehouseman.component").then(
        (m) => m.WarehousemanComponent
      ),
    children: warehousemanRoutes,
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
