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
import { AuthService } from "../services/auth.service";
import { MediaMatcher } from "@angular/cdk/layout";

@Component({
  selector: "app-main",
  templateUrl: "./admin.component.html",
  styleUrl: "./admin.component.scss",
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
})
export class AdminComponent {
  private readonly auth = inject(AuthService);
  mobileQuery: MediaQueryList;

  private readonly _mobileQueryListener: () => void;

  constructor() {
    const changeDetectorRef = inject(ChangeDetectorRef);
    const media = inject(MediaMatcher);

    this.mobileQuery = media.matchMedia("(max-width: 600px)");
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener("change", this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener("change", this._mobileQueryListener);
  }

  onLogout() {
    this.auth.logout();
  }
}
