import { Component, inject, signal } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { ActionToolbarComponent } from "../../components/action-toolbar/action-toolbar.component";
import { EventInfoComponent } from "../../components/events/event-info/event-info.component";
import { LoaderComponent } from "../../components/loader/loader.component";
import { EventItemDto } from "../../models/events";
import { EventsService } from "../../services/events.service";
import { WorkerEventFilesComponent } from "./worker-event-files/worker-event-files.component";

@Component({
  selector: "app-worker-show-event",
  imports: [
    LoaderComponent,
    ActionToolbarComponent,
    EventInfoComponent,
    WorkerEventFilesComponent
],
  templateUrl: "./worker-show-event.component.html",
  styleUrl: "./worker-show-event.component.scss",
})
export class WorkerShowEventComponent {
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
  });

  loading = signal<boolean>(true);
  eventId: number = Number(this.route.snapshot.paramMap.get("eventId"));
  tabIndex: number = Number(this.route.snapshot.queryParams["tab"] ?? 0);

  constructor() {
    console.log(this.eventId);
    this.service.geEventInfoForWorker(this.eventId).subscribe((resp) => {
      if (resp.ok) {
        this.eventData.set(resp.data);
      }
      this.loading.set(false);
    });
  }

}
