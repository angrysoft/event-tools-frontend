import { Component, input, output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";
import { SafeHtmlPipe } from "../../../pipes/safe-html.pipe";

@Component({
  selector: "app-worker-desc",
  imports: [
    MatCardModule,
    SafeHtmlPipe,
    MatButtonModule,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: "./worker-desc.component.html",
  styleUrl: "./worker-desc.component.scss",
})
export class WorkerDescComponent {
  desc = input.required<string | null>();
  worker = input.required<number | null>();
  deleteDesc = output();

  
}
