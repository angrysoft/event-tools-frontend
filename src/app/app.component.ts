import { Component, inject, OnInit } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { RouterOutlet } from "@angular/router";
import { SwPush } from "@angular/service-worker";
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

  push = inject(SwPush);

  ngOnInit(): void {
    this.matIconRegistry.setDefaultFontSetClass("material-symbols-outlined");
    this.auth.getUser();

    this.push.requestSubscription({
      serverPublicKey:
        "BEUum4KKvvTWJlV9PNviPj-hRn4wHkyzdnCaEgdczV4t-_QZOasnzVGUMOhkJUMxNjVdSEI3efK-_XkLSK5QEo4",
    });
  }
}
