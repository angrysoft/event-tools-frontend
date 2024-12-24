import { inject } from "@angular/core";
import { CanActivateFn, RedirectCommand, Router } from "@angular/router";
import { AuthService } from "./services/auth.service";

const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return true;
  } else {
    const loginPath = router.parseUrl("/login");
    return new RedirectCommand(loginPath, { skipLocationChange: true });
  }
};

const isAdmin: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAdmin()) return true;
  else if (auth.isAuthenticated()) {
    const accessDenied = router.parseUrl("/accessDenied");
    return new RedirectCommand(accessDenied, { skipLocationChange: true });
  } else {
    const loginPath = router.parseUrl("/login");
    return new RedirectCommand(loginPath, { skipLocationChange: true });
  }
};

const isAccountManager: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
   if (auth.isAccountManager()) return true;
   else if (auth.isAuthenticated()) {
     const accessDenied = router.parseUrl("/accessDenied");
     return new RedirectCommand(accessDenied, { skipLocationChange: true });
   } else {
     const loginPath = router.parseUrl("/login");
     return new RedirectCommand(loginPath, { skipLocationChange: true });
   }
}

const isWorker: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
   if (auth.isWorker()) return true;
   else if (auth.isAuthenticated()) {
     const accessDenied = router.parseUrl("/accessDenied");
     return new RedirectCommand(accessDenied, { skipLocationChange: true });
   } else {
     const loginPath = router.parseUrl("/login");
     return new RedirectCommand(loginPath, { skipLocationChange: true });
   }
}

export { authGuard, isAdmin, isAccountManager, isWorker };
