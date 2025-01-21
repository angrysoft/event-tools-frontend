import { Component, inject, OnInit } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { RouterOutlet } from "@angular/router";
import { SwPush, SwUpdate } from "@angular/service-worker";
import { AuthService } from "./services/auth.service";
import { ConfirmDialogComponent } from "./components/confirm-dialog/confirm-dialog.component";
import { MatDialog } from "@angular/material/dialog";

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
  private readonly push = inject(SwPush);
  private readonly swUpdate = inject(SwUpdate);
  private readonly dialog = inject(MatDialog);

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

    this.push
      .requestSubscription({
        serverPublicKey:
          "BEUum4KKvvTWJlV9PNviPj-hRn4wHkyzdnCaEgdczV4t-_QZOasnzVGUMOhkJUMxNjVdSEI3efK-_XkLSK5QEo4",
      })
      .then((sub) => {
        console.log("Notification Subscription: ", sub);
      })
      .catch((err) => {
        console.error("Nie udało sie zapisać do subskrypcji", err);
      });

    if (this.swUpdate.isEnabled) {
      const confirm = this.dialog.open(ConfirmDialogComponent, {
        data: {
          msg: "Nowa wersja jest dostępna do zainstalowania. Czy chcesz zaktualizować aplikację?",
        },
      });

      confirm.afterClosed().subscribe((result) => {
        if (result === true) {
          this.swUpdate.activateUpdate().then(() => window.location.reload());
        }
      });
    }
  }
}
