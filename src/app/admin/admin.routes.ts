import { Routes } from "@angular/router";

export const adminRoutes: Routes = [
  {
    path: "workers",
    title: "Pracownicy",
    loadComponent: () =>
      import("./workers/workers.component").then((m) => m.WorkersComponent),
  },
  {
    path: "workers/add",
    title: "Dodaj Pracownika",
    loadComponent: () =>
      import("./workers/add-worker/add-worker.component").then(
        (m) => m.AddWorkerComponent,
      ),
  },
  {
    path: "workers/edit/:id",
    title: "Zmień Dane Pracownika",
    loadComponent: () =>
      import("./workers/edit-worker/edit-worker.component").then(
        (m) => m.EditWorkerComponent,
      ),
  },
  {
    path: "workers/:id",
    title: "Dane Pracownika",
    loadComponent: () =>
      import("./workers/show-worker/show-worker.component").then(
        (m) => m.ShowWorkerComponent,
      ),
  },
  {
    path: "workers/doc/add",
    title: "Edytuj Dokument",
    loadComponent: () =>
      import("./workers/show-worker/docs/doc-form/doc-form.component").then(
        (m) => m.DocFormComponent,
      ),
  },
  {
    path: "workers/doc/:id",
    title: "Edytuj Dokument",
    loadComponent: () =>
      import("./workers/show-worker/docs/doc-form/doc-form.component").then(
        (m) => m.DocFormComponent,
      ),
  },
  {
    path: "settings/groups",
    title: "Grupy",
    loadComponent: () =>
      import("./settings/groups/groups.component").then(
        (m) => m.GroupsComponent,
      ),
  },
  {
    path: "settings/groups/add",
    title: "Dodaj Grupe",
    loadComponent: () =>
      import("./settings/groups/add-group/add-group.component").then(
        (m) => m.AddGroupComponent,
      ),
  },
  {
    path: "settings/groups/:id",
    title: "Edycja Grupy",
    loadComponent: () =>
      import("./settings/groups/edit-group/edit-group.component").then(
        (m) => m.EditGroupComponent,
      ),
  },
  {
    path: "settings/teams",
    title: "Ekipa",
    loadComponent: () =>
      import("./settings/teams/teams.component").then((m) => m.TeamsComponent),
  },
  {
    path: "settings/teams/add",
    title: "Dodaj Ekipe",
    loadComponent: () =>
      import("./settings/teams/add-team/add-team.component").then(
        (m) => m.AddTeamComponent,
      ),
  },
  {
    path: "settings/teams/:id",
    title: "Edytuj Ekipe",
    loadComponent: () =>
      import("./settings/teams/edit-team/edit-team.component").then(
        (m) => m.EditTeamComponent,
      ),
  },
];
