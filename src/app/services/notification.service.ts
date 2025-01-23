import { inject, Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { SwPush, SwUpdate } from "@angular/service-worker";
import { ConfirmDialogComponent } from "../components/confirm-dialog/confirm-dialog.component";

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  private readonly push = inject(SwPush);
  private readonly swUpdate = inject(SwUpdate);
  private readonly dialog = inject(MatDialog);
  constructor() {}

  registerNotification() {
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
      this.swUpdate.checkForUpdate().then((update) => {
        if (!update) return;
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
      });
    }
    console.log("in notification");
  }
}
