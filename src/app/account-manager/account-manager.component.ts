import { Component, OnInit } from "@angular/core";
import { MainNavComponent } from "../components/main-nav/main-nav.component";
import { MenuActionComponent } from "../components/menu-action/menu-action.component";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatDividerModule } from "@angular/material/divider";
import { registerNotification } from "../utils/registerNotification";

@Component({
  selector: "app-account-manager",
  imports: [
    MainNavComponent,
    MenuActionComponent,
    MatExpansionModule,
    MatDividerModule,
  ],
  templateUrl: "./account-manager.component.html",
  styleUrl: "./account-manager.component.scss",
})
export class AccountManagerComponent implements OnInit {
  ngOnInit(): void {
    registerNotification();
  }
}
