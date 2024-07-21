import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-show-worker",
  standalone: true,
  imports: [MatIconModule, MatDividerModule, MatButtonModule],
  templateUrl: "./show-worker.component.html",
  styleUrl: "./show-worker.component.scss",
})
export class ShowWorkerComponent {}
