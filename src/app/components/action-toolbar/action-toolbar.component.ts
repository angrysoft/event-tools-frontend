import { Component, HostListener, inject, input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { Router } from "@angular/router";

@Component({
  selector: "app-action-toolbar",
  imports: [MatButtonModule, MatIconModule],
  templateUrl: "./action-toolbar.component.html",
  styleUrl: "./action-toolbar.component.scss",
})
export class ActionToolbarComponent {
  router = inject(Router);
  backTo = input<string>("");
  title = input.required<string>();

  get showBackTo() {
    return this.backTo().length > 0;
  }

  @HostListener("document:keydown.Escape", ["$event"])
  handleBackTo() {
    this.router.navigateByUrl(this.backTo());
  }
}
