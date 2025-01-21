import { Component, inject, OnInit } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { RouterOutlet } from "@angular/router";
import { AuthService } from "./services/auth.service";
import { SwPush, SwUpdate } from "@angular/service-worker";

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

  sw = inject(SwUpdate);
  push = inject(SwPush);

  ngOnInit(): void {
    this.matIconRegistry.setDefaultFontSetClass("material-symbols-outlined");
    this.auth.getUser();
    this.sw.versionUpdates.subscribe((evt) => {
      switch (evt.type) {
        case "VERSION_DETECTED":
          console.log(`Downloading new app version: ${evt.version.hash}`);
          break;
        case "VERSION_READY":
          console.log(`Current app version: ${evt.currentVersion.hash}`);
          console.log(
            `New app version ready for use: ${evt.latestVersion.hash}`
          );
          break;
        case "VERSION_INSTALLATION_FAILED":
          console.log(
            `Failed to install app version '${evt.version.hash}': ${evt.error}`
          );
          break;
      }
    });
    this.push.messages.subscribe((message) => {
      console.log("Push message", message);
    });

    
  }
}
