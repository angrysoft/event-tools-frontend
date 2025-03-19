import { inject, Injectable } from "@angular/core";
import { SwPush, SwUpdate } from "@angular/service-worker";

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  private readonly push = inject(SwPush);
  private readonly swUpdate = inject(SwUpdate);
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
        if (update)
          this.swUpdate.activateUpdate().then(() => window.location.reload());
      });
    }
  }
}
