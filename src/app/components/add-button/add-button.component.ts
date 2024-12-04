import { Component, HostListener, inject, input, output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { Router } from "@angular/router";

@Component({
  selector: "app-add-button",
  imports: [MatIconModule, MatButtonModule],
  templateUrl: "./add-button.component.html",
  styleUrl: "./add-button.component.scss",
})
export class AddButtonComponent {
  url = input<string>("");
  router = inject(Router);
  action = output();

  @HostListener("document:keydown.Alt.a", ["$event"])
  handleAdd() {
    if (this.url().length > 0)
      this.router.navigateByUrl(this.url(), { replaceUrl: true });
    this.action.emit();
  }
}
