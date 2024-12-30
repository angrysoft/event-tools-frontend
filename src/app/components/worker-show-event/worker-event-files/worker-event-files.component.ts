import { AfterViewInit, Component, inject, input, signal } from "@angular/core";
import { EventFile } from "../../../models/events";
import { EventsService } from "../../../services/events.service";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "app-worker-event-files",
  imports: [MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: "./worker-event-files.component.html",
  styleUrl: "./worker-event-files.component.scss",
})
export class WorkerEventFilesComponent implements AfterViewInit {
  eventId = input.required<number>();
  service = inject(EventsService);
  files = signal<EventFile[]>([]);

  ngAfterViewInit(): void {
    this.service.getEventFilesForWorker(this.eventId()).subscribe((resp) => {
      if (resp.ok) this.files.set(resp.data);
    });
  }
}
