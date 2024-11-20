import {
  BreakpointObserver,
  Breakpoints,
  MediaMatcher,
} from "@angular/cdk/layout";
import { AsyncPipe } from "@angular/common";
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, inject, OnDestroy, ViewChild, viewChild } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatDrawer, MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterOutlet } from "@angular/router";
import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
import { MenuActionComponent } from "../components/menu-action/menu-action.component";
import { AuthService } from "../services/auth.service";

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
export class AdminComponent implements OnDestroy {
  mobileQuery: MediaQueryList;
  private auth = inject(AuthService);
  private readonly _mobileQueryListener: () => void;
  @ViewChild("drawer") drawer !: ElementRef<MatDrawer>;

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
