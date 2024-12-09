import { Component, input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-action-toolbar",
  imports: [MatButtonModule, MatIconModule, RouterLink],
  templateUrl: "./action-toolbar.component.html",
  styleUrl: "./action-toolbar.component.scss",
})
export class ActionToolbarComponent {
  backTo = input<string>("");
  title = input.required<string>();

  get showBackTo() {
    return this.backTo().length > 0;
  }
}
