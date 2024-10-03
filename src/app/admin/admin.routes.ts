import { Routes } from "@angular/router";
import { settingsRoutes } from "./settings/settings.route";
import { workersRoutes } from "./workers/worker.routes";

export const adminRoutes: Routes = [
  {
    path: "dashboard",
    title: "Dashboard",
    loadComponent: () =>
      import("./dashboard/dashboard.component").then(
        (m) => m.DashboardComponent,
      ),
  },
  ...workersRoutes,
  ...settingsRoutes,
];
