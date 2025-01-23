import { inject } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { SwPush, SwUpdate } from "@angular/service-worker";
import { ConfirmDialogComponent } from "../components/confirm-dialog/confirm-dialog.component";

export function registerNotification() {
  const push = inject(SwPush);
  const swUpdate = inject(SwUpdate);
  const dialog = inject(MatDialog);

  push
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

  if (swUpdate.isEnabled) {
    swUpdate.checkForUpdate().then((update) => {
      if (!update) return;
      const confirm = dialog.open(ConfirmDialogComponent, {
        data: {
          msg: "Nowa wersja jest dostępna do zainstalowania. Czy chcesz zaktualizować aplikację?",
        },
      });
      confirm.afterClosed().subscribe((result) => {
        if (result === true) {
          swUpdate.activateUpdate().then(() => window.location.reload());
        }
      });
    });
  }
}
