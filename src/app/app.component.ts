import { Component, inject, OnInit } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { RouterOutlet } from "@angular/router";
import { AuthService } from "./services/auth.service";

@Component({
  selector: "app-root",
  imports: [RouterOutlet],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent implements OnInit {
  title = "Event Tools";
  private readonly matIconRegistry = inject(MatIconRegistry);
  private readonly auth = inject(AuthService);

  constructor() {
    const r = document.querySelector(":root") as HTMLElement;
    if (!r) return;
    const theme = localStorage.getItem("theme");
    if (!theme || theme === "system") {
      r.style.setProperty("--color-theme", "light dark");
    } else if (theme === "light") {
      r.style.setProperty("--color-theme", "light");
    } else {
      r.style.setProperty("--color-theme", "dark");
    }
  }

  ngOnInit(): void {
    this.matIconRegistry.setDefaultFontSetClass("material-symbols-outlined");
    this.auth.getUser();
  }
}
