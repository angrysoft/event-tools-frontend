import { DatePipe, KeyValuePipe } from "@angular/common";
import { Component, inject, input, OnInit, signal } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { EventDaysService } from "../../../services/event-days.service";
import { EventDay, EventItemDto } from "../../../models/events";
import { WorkerEventDayComponent } from "../../events/worker-event-day/worker-event-day.component";

@Component({
  selector: "app-worker-event-days",
  imports: [MatCardModule, DatePipe, WorkerEventDayComponent, KeyValuePipe],
  templateUrl: "./worker-event-days.component.html",
  styleUrl: "./worker-event-days.component.scss",
})
export class WorkerEventDaysComponent implements OnInit {
  private readonly service = inject(EventDaysService);
  eventId = input.required<number>();
  statuses = signal<{ [key: string]: string }>({});
  eventDays = signal<EventDay[]>([]);
  eventInfo = signal<EventItemDto>({
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

  tableColumns: { name: string; def: string }[] = [
    { name: "Start", def: "startTime" },
    { name: "Koniec", def: "endTime" },
    { name: "Godziny", def: "workHours" },
    { name: "Pracownik", def: "workerName" },
    { name: "Stawka", def: "rateName" },
    { name: "Dodatki", def: "addons" },
  ];

  constructor() {
    this.service.getStatuses().subscribe((resp) => {
      this.statuses.set(resp.data);
    });
  }

  ngOnInit(): void {
    this.loadDays();
  }

  private loadDays() {
    this.loading.set(true);
    this.service.getDaysChief(this.eventId()).subscribe((resp) => {
      if (resp.ok) {
        this.eventInfo.set(resp.data.info);
        this.eventDays.set(resp.data.eventDays);
      }
      this.loading.set(false);
    });
  }
}
