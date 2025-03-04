import { Component, HostListener, inject, input, output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { Router } from "@angular/router";

@Component({
  selector: "app-zoom-actions",
  imports: [MatIconModule, MatButtonModule],
  templateUrl: "./zoom-actions.component.html",
  styleUrl: "./zoom-actions.component.scss",
})
export class ZoomActionsComponent {
  url = input<string>("");
  showAdd = input<boolean>(false);
  router = inject(Router);
  action = output();
  zoom = output<string>();
  disableIn = input<boolean>(false);
  disableOut = input<boolean>(false);

  @HostListener("document:keydown.Alt.a", ["$event"])
  handleAdd() {
    if (this.url().length > 0)
      this.router.navigateByUrl(this.url(), { replaceUrl: true });
    this.action.emit();
  }

  zoomAction(zoomAction: string) {
    this.zoom.emit(zoomAction);
  }
}
