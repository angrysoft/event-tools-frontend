import { Component, inject, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatTabsModule } from "@angular/material/tabs";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { ActionToolbarComponent } from "../../../components/action-toolbar/action-toolbar.component";
import { ConfirmDialogComponent } from "../../../components/confirm-dialog/confirm-dialog.component";
import { EventFilesComponent } from "../../../components/events/event-files/event-files.component";
import { EventInfoComponent } from "../../../components/events/event-info/event-info.component";
import { LoaderComponent } from "../../../components/loader/loader.component";
import { EventItemDto } from "../../../models/events";
import { EventsService } from "../../../services/events.service";

@Component({
  selector: "app-show-event",
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTabsModule,
    LoaderComponent,
    RouterLink,
    EventInfoComponent,
    EventFilesComponent,
    ActionToolbarComponent,
  ],
  templateUrl: "./show-event.component.html",
  styleUrl: "./show-event.component.scss",
})
export class ShowEventComponent {
  readonly route = inject(ActivatedRoute);
  readonly confirm = inject(MatDialog);
  readonly router = inject(Router);
  readonly service = inject(EventsService);
  eventData = signal<EventItemDto>({
    id: 0,
    name: "",
    number: "",
    description: "",
    coordinator: "",
    accountManager: "",
    chief: "",
    editors: [],
    coordinatorId: 0,
    edited: "",
  });

  loading = signal<boolean>(true);
  workersMails = signal<string[]>([]);

  eventId: number = Number(this.route.snapshot.paramMap.get("eventId"));
  tabIndex: number = Number(this.route.snapshot.queryParams["tab"] ?? 0);

  constructor() {
    this.service.getInfo(this.eventId).subscribe((resp) => {
      if (resp.ok) {
        this.eventData.set(resp.data);
      }
      this.loading.set(false);
    });

    this.service.getWorkersMails(this.eventId).subscribe((resp) => {
      if (resp.ok) {
        this.workersMails.set(resp.data);
      }
    });
  }

  get mailUrl() {
    return encodeURI(
      `mailto:${this.workersMails().join(";")}?bcc=koordynacja@ves.pl&subject=${
        this.eventData().number
      } ${
        this.eventData().name
      }&body=Cześć\nInformacje o imprezie są gotowe proszę o zapoznanie się z nimi.\n\nPozdrawiam.`
    );
  }

  removeEvent() {
    const dialogRef = this.confirm.open(ConfirmDialogComponent, {
      data: { msg: "Usnąć Imprezę jest to operacja nieodwracalna" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true && this.eventData().id) {
        this.service.delete(this.eventData().id ?? -1).subscribe((response) => {
          if (response.ok) {
            this.router.navigateByUrl("/admin/events", { replaceUrl: true });
          } else this.service.showError(response);
        });
      }
    });
  }
}
