import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "./services/auth.service";

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  console.log("is auth: ", auth.isAuthenticated())
  if (auth.isAuthenticated()) {
    return true;
  } else {
    return router.parseUrl("/login");
  }
  // return auth.isAuthenticated();
};
