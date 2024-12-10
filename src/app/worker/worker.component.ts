import { ChangeDetectorRef, Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterOutlet } from "@angular/router";
import { MenuActionComponent } from "../components/menu-action/menu-action.component";
import { MediaMatcher } from "@angular/cdk/layout";
import { AuthService } from "../services/auth.service";
import { MatDialog } from "@angular/material/dialog";
import { SetThemeComponent } from "../components/settings/set-theme/set-theme.component";

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
    throw new Error("Method not implemented.");
  }
  changeTheme() {
    const changeThemeDialog = this.dialog.open(SetThemeComponent);
  }
}
