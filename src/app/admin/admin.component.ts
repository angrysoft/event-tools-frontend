import { Component, OnInit } from "@angular/core";
import { MatDividerModule } from "@angular/material/divider";
import { MatExpansionModule } from "@angular/material/expansion";
import { MainNavComponent } from "../components/main-nav/main-nav.component";
import { MenuActionComponent } from "../components/menu-action/menu-action.component";
import { registerNotification } from "../utils/registerNotification";

@Component({
  selector: "app-main",
  templateUrl: "./admin.component.html",
  styleUrl: "./admin.component.scss",
  imports: [
    MatExpansionModule,
    MenuActionComponent,
    MainNavComponent,
    MatDividerModule,
  ],
})
export class AdminComponent implements OnInit {
 ngOnInit(): void {
     registerNotification();
 }
}
