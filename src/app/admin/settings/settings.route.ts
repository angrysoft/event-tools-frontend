import { Routes } from "@angular/router";

export const settingsRoutes: Routes = [
  {
    path: "settings/groups",
    title: "Grupy",
    loadComponent: () =>
      import("./groups/groups.component").then(
        (m) => m.GroupsComponent,
      ),
  },
  {
    path: "settings/groups/add",
    title: "Dodaj Grupe",
    loadComponent: () =>
      import("./groups/group-form/group-form.component").then(
        (m) => m.GroupFormComponent,
      ),
  },
  {
    path: "settings/groups/:groupId",
    title: "Edycja Grupy",
    loadComponent: () =>
      import("./groups/group-form/group-form.component").then(
        (m) => m.GroupFormComponent,
      ),
  },
  {
    path: "settings/teams",
    title: "Ekipa",
    loadComponent: () =>
      import("./teams/teams.component").then((m) => m.TeamsComponent),
  },
  {
    path: "settings/teams/add",
    title: "Dodaj Ekipe",
    loadComponent: () =>
      import(".//teams/team-form/team-form.component").then(
        (m) => m.TeamFormComponent,
      ),
  },
  {
    path: "settings/teams/:teamId",
    title: "Edytuj Ekipe",
    loadComponent: () =>
      import("./teams/team-form/team-form.component").then(
        (m) => m.TeamFormComponent,
      ),
  },
  {
    path: "settings/rates",
    title: "Stawki",
    loadComponent: () =>
      import("./rates/rates.component").then((m) => m.RatesComponent),
  },
  {
    path: "settings/rates/add",
    title: "Dodaj Stawkę",
    loadComponent: () =>
      import("./rates/rate-form/rate-form.component").then(
        (m) => m.RateFormComponent,
      ),
  },
  {
    path: "settings/rates/:id",
    title: "Edytuj Stawkę",
    loadComponent: () =>
      import("./rates/rate-form/rate-form.component").then(
        (m) => m.RateFormComponent,
      ),
  },
  {
    path: "settings/addons",
    title: "Dodatki",
    loadComponent: () =>
      import("./addons/addons.component").then(
        (m) => m.AddonsComponent,
      ),
  },
  {
    path: "settings/addons/add",
    title: "Dodaj Dodatek",
    loadComponent: () =>
      import("./addons/addon-form/addon-form.component").then(
        (m) => m.AddonFormComponent,
      ),
  },
  {
    path: "settings/addons/:id",
    title: "Edytuj Dodatek",
    loadComponent: () =>
      import("./addons/addon-form/addon-form.component").then(
        (m) => m.AddonFormComponent,
      ),
  },
  {
    path: "settings/cars",
    title: "Auta",
    loadComponent: () =>
      import("./cars/cars.component").then((m) => m.CarsComponent),
  },
  {
    path: "settings/cars/add",
    title: "Dodaj Auto",
    loadComponent: () =>
      import("./cars/car-form/car-form.component").then((m) => m.CarFormComponent),
  },
  {
    path: "settings/cars/edit/:car",
    title: "Auto",
    loadComponent: () =>
      import("./cars/car-form/car-form.component").then((m) => m.CarFormComponent),
  },
  {
    path: "settings/cars/:car/doc/add",
    title: "Auto",
    loadComponent: () =>
      import("./cars/car-doc-form/car-doc-form.component").then((m) => m.CarDocFormComponent),
  },
  {
    path: "settings/cars/:car/doc/:doc",
    title: "Auto",
    loadComponent: () =>
      import("./cars/car-doc-form/car-doc-form.component").then((m) => m.CarDocFormComponent),
  },
  {
    path: "settings/cars/:car",
    title: "Auto",
    loadComponent: () =>
      import("./cars/show-car/show-car.component").then((m) => m.ShowCarComponent),
  },
];
