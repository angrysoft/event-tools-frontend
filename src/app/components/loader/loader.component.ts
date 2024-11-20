import { Component, effect, input, signal } from "@angular/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
    selector: "app-loader",
    imports: [MatProgressSpinnerModule],
    templateUrl: "./loader.component.html",
    styleUrl: "./loader.component.scss"
})
export class LoaderComponent {
  loading = input.required<boolean>();
  classes:string[] = [];

  constructor() {
    effect(() => {
      if (this.loading()) this.classes = ["loader", "loader-show"];
      else this.classes = ["loader"];
    });
  }
}
