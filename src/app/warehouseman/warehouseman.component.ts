import { Component, inject, OnInit } from "@angular/core";
import { MainNavComponent } from "../components/main-nav/main-nav.component";
import { MenuActionComponent } from "../components/menu-action/menu-action.component";
import { MatDividerModule } from "@angular/material/divider";
import { NotificationService } from "../services/notification.service";

@Component({
  selector: "app-warehouseman",
  imports: [MainNavComponent, MenuActionComponent, MatDividerModule],
  templateUrl: "./warehouseman.component.html",
  styleUrl: "./warehouseman.component.scss",
})
export class WarehousemanComponent implements OnInit {
  notify = inject(NotificationService);

  ngOnInit(): void {
    this.notify.registerNotification();
  }
}
