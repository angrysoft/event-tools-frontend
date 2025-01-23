import { Component, OnInit } from "@angular/core";
import { MatExpansionModule } from "@angular/material/expansion";
import { MainNavComponent } from "../components/main-nav/main-nav.component";
import { MenuActionComponent } from "../components/menu-action/menu-action.component";
import { MatDividerModule } from "@angular/material/divider";
import { registerNotification } from "../utils/registerNotification";

@Component({
  selector: "app-worker",
  imports: [
    MatExpansionModule,
    MainNavComponent,
    MenuActionComponent,
    MatDividerModule,
  ],
  templateUrl: "./worker.component.html",
  styleUrl: "./worker.component.scss",
})
export class WorkerComponent implements OnInit {
  ngOnInit(): void {
    registerNotification();
  }
}
