import { Routes } from "@angular/router";
import { authGuard } from "./auth.guard";
import { LoginComponent } from "./login/login.component";
import { MainComponent } from "./main/main.component";

export const routes: Routes = [
  { path: "login", component: LoginComponent, title: "Login" },
  {
    path: "",
    component: MainComponent,
    canActivate: [authGuard],
    title: "Event Tool",
  },
];
