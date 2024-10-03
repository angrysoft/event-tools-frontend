import { Routes } from "@angular/router";

export const workersRoutes: Routes = [
  {
    path: "workers",
    title: "Pracownicy",
    loadComponent: () =>
      import("./workers.component").then((m) => m.WorkersComponent),
  },
  {
    path: "workers/add",
    title: "Dodaj Pracownika",
    loadComponent: () =>
      import("./add-worker/add-worker.component").then(
        (m) => m.AddWorkerComponent,
      ),
  },
  {
    path: "workers/edit/:id",
    title: "Zmień Dane Pracownika",
    loadComponent: () =>
      import("./edit-worker/edit-worker.component").then(
        (m) => m.EditWorkerComponent,
      ),
  },
  {
    path: "workers/:id",
    title: "Dane Pracownika",
    loadComponent: () =>
      import("./show-worker/show-worker.component").then(
        (m) => m.ShowWorkerComponent,
      ),
  },
  {
    path: "workers/:workerId/doc/add",
    title: "Edytuj Dokument",
    loadComponent: () =>
      import("./docs/doc-form/doc-form.component").then(
        (m) => m.DocFormComponent,
      ),
  },
  {
    path: "workers/:workerId/doc/:id",
    title: "Edytuj Dokument",
    loadComponent: () =>
      import("./docs/doc-form/doc-form.component").then(
        (m) => m.DocFormComponent,
      ),
  },
  {
    path: "workers/:workerId/rates/add",
    title: "Przypisz Stawkę",
    loadComponent: () =>
      import("./rates/rate-value-form/rate-value-form.component").then(
        (m) => m.RateValueFormComponent,
      ),
  },
  {
    path: "workers/:workerId/rates/:rateValueId",
    title: "Edytuj Stawkę",
    loadComponent: () =>
      import("./rates/rate-value-form/rate-value-form.component").then(
        (m) => m.RateValueFormComponent,
      ),
  },
  {
    path: "workers/:workerId/addons/add",
    title: "Przypisz Dodatek",
    loadComponent: () =>
      import("./addons/addon-value-form/addon-value-form.component").then(
        (m) => m.AddonValueFormComponent,
      ),
  },
  {
    path: "workers/:workerId/addons/:addonValueId",
    title: "Edytuj Dodatek",
    loadComponent: () =>
      import("./addons/addon-value-form/addon-value-form.component").then(
        (m) => m.AddonValueFormComponent,
      ),
  },
  {
    path: "workers/:workerId/cars",
    title: "Auta",
    loadComponent: () =>
      import("./cars/cars.component").then(
        (m) => m.CarsComponent,
      ),
  },
  {
    path: "workers/:workerId/cars/add",
    title: "Dodaj Auto",
    loadComponent: () =>
      import("../settings/cars/car-form/car-form.component").then(
        (m) => m.CarFormComponent,
      ),
  },
  {
    path: "workers/:workerId/cars/:addonValueId",
    title: "Edytuj Auto",
    loadComponent: () =>
      import("../settings/cars/car-form/car-form.component").then(
        (m) => m.CarFormComponent,
      ),
  },
];
