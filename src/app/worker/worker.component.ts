import { ChangeDetectorRef, Component, inject, viewChild } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatSidenav, MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterOutlet } from "@angular/router";
import { MenuActionComponent } from "../components/menu-action/menu-action.component";
import { MediaMatcher } from "@angular/cdk/layout";
import { AuthService } from "../services/auth.service";
import { MatDialog } from "@angular/material/dialog";
import { SetThemeComponent } from "../components/settings/set-theme/set-theme.component";
import { ChangePasswordComponent } from "../components/settings/change-password/change-password.component";

@Component({
  selector: "app-worker",
  imports: [
    MatExpansionModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatMenuModule,
    RouterOutlet,
    MenuActionComponent,
  ],
  templateUrl: "./worker.component.html",
  styleUrl: "./worker.component.scss",
})
export class WorkerComponent {
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
    const changePassword = this.dialog.open(ChangePasswordComponent);
  }
  changeTheme() {
    const changeThemeDialog = this.dialog.open(SetThemeComponent);
  }

  sideNavOnClick(ev:any) {
    if (this.mobileQuery.matches && !ev.target.tagName.startsWith("MAT-")) {
      this.sideNav()?.close();
    }
  }
}
