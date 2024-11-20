import { Component, HostListener, inject, input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { Router, RouterLink } from "@angular/router";

@Component({
    selector: "app-add-button",
    imports: [MatIconModule, RouterLink, MatButtonModule],
    templateUrl: "./add-button.component.html",
    styleUrl: "./add-button.component.scss"
})
export class AddButtonComponent {
  url = input.required<string>();
  router = inject(Router);

  @HostListener("document:keydown.Alt.a", ['$event'])
  handleAdd() {
    this.router.navigateByUrl(this.url(), { replaceUrl: true });
  }
}
