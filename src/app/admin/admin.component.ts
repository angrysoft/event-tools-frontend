import { Component, inject, OnInit } from "@angular/core";
import { MatDividerModule } from "@angular/material/divider";
import { MatExpansionModule } from "@angular/material/expansion";
import { MainNavComponent } from "../components/main-nav/main-nav.component";
import { MenuActionComponent } from "../components/menu-action/menu-action.component";
import { NotificationService } from "../services/notification.service";

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
 notify = inject(NotificationService);
   ngOnInit(): void {
     this.notify.registerNotification();
   }
}
