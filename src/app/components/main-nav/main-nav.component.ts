import { MediaMatcher } from "@angular/cdk/layout";
import {
  ChangeDetectorRef,
  Component,
  inject,
  viewChild,
  OnDestroy,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatSidenavModule, MatSidenav } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterOutlet } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { ChangePasswordComponent } from "../settings/change-password/change-password.component";
import { SetThemeComponent } from "../settings/set-theme/set-theme.component";

@Component({
  selector: "app-main-nav",
  imports: [
    MatExpansionModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatMenuModule,
    RouterOutlet,
  ],
  templateUrl: "./main-nav.component.html",
  styleUrl: "./main-nav.component.scss",
})
export class MainNavComponent implements OnDestroy {
  private readonly auth = inject(AuthService);
  private readonly dialog = inject(MatDialog);
  mobileQuery: MediaQueryList;
  private readonly _mobileQueryListener: () => void;
  username = "";
  sideNav = viewChild<MatSidenav>("drawer");

  constructor() {
    this.username = `${this.auth.user?.firstName} ${this.auth.user?.lastName}`;
    const changeDetectorRef = inject(ChangeDetectorRef);
    const media = inject(MediaMatcher);

    this.mobileQuery = media.matchMedia("(max-width: 600px)");
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener("change", this._mobileQueryListener);
    if (this.mobileQuery.matches) {
      this.username = `${this.auth.user?.firstName.at(
        0
      )} ${this.auth.user?.lastName.at(0)}`;
    }
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener("change", this._mobileQueryListener);
  }

  onLogout() {
    this.auth.logout();
  }

  changePassword() {
    this.dialog.open(ChangePasswordComponent);
  }
  changeTheme() {
    this.dialog.open(SetThemeComponent);
  }

  sideNavOnClick(ev: MouseEvent) {
    if (
      this.mobileQuery.matches &&
      !(ev.target as HTMLElement)?.tagName.startsWith("MAT-")
    ) {
      this.sideNav()?.close();
    }
  }
}
