import { DatePipe } from "@angular/common";
import { Component, inject, signal, ViewChild } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from "@angular/material/slide-toggle";
import { MatTable, MatTableModule } from "@angular/material/table";
import { ActivatedRoute } from "@angular/router";
import { ActionToolbarComponent } from "../../../components/action-toolbar/action-toolbar.component";
import { LoaderComponent } from "../../../components/loader/loader.component";
import { EventDay, EventItemDto, WorkerDay } from "../../../models/events";
import { EventDaysService } from "../../services/event-days.service";
import { WorkerDaysService } from "../../services/worker-days.service";
import { EventReportDataSource } from "./event-report-datasource";
import { ReportsService } from "../../../services/reports.service";

@Component({
  selector: "app-event-report-view",
  imports: [
    LoaderComponent,
    ActionToolbarComponent,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    DatePipe,
    MatSlideToggleModule,
  ],
  templateUrl: "./event-report-view.component.html",
  styleUrl: "./event-report-view.component.scss",
})
export class EventReportViewComponent {
  reportService = inject(ReportsService);
  service = inject(EventDaysService);
  workerDayService = inject(WorkerDaysService);
  route = inject(ActivatedRoute);
  loading = signal<boolean>(true);
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
  hideMoney = signal<boolean>(false);
  eventId = Number(this.route.snapshot.paramMap.get("eventId") ?? -1);
  @ViewChild(MatTable) table!: MatTable<WorkerDay>;
  dataSource!: EventReportDataSource;

  
  tableColumnsFull: { name: string; def: string }[] = [
    { name: "Start", def: "startTime" },
    { name: "Koniec", def: "endTime" },
    { name: "Godziny", def: "workHours" },
    { name: "Pracownik", def: "workerName" },
    { name: "Stawka", def: "rateName" },
    { name: "Kwota", def: "rateMoney" },
    { name: "Dodatki", def: "addons" },
    { name: "Suma", def: "total" },
  ];
  
  tableColumnsHided: { name: string; def: string }[] = [
    { name: "Start", def: "startTime" },
    { name: "Koniec", def: "endTime" },
    { name: "Godziny", def: "workHours" },
    { name: "Pracownik", def: "workerName" },
    { name: "Stawka", def: "rateName" },
  ];
  
  tableColumns: { name: string; def: string }[] = this.tableColumnsFull
  
  constructor() {
    this.workerDayService.getStatuses().subscribe((resp) => {
      if (resp.ok) this.statuses.set(resp.data);
    });
    if (this.eventId) {
      this.loadDays();
    }
    this.dataSource = new EventReportDataSource();
  }

  ngAfterViewInit(): void {
    this.table.dataSource = this.dataSource;
  }

  get columnNames() {
    return this.tableColumns.map((el) => el.def);
  }

  getStatus(state: string) {
    return this.statuses()[state];
  }

  private loadDays() {
    this.reportService.getEventRaport(this.eventId).subscribe((resp) => {
      if (resp.ok) {
        this.eventInfo.set(resp.data.info);
        this.eventDays.set(resp.data.eventDays);
        this.dataSource.loadData(resp.data.eventDays);
      }
      this.loading.set(false);
    });
  }

  onHide(ev: MatSlideToggleChange) {
    if (ev.checked) {
      this.tableColumns = this.tableColumnsHided;
    } else {
      this.tableColumns = this.tableColumnsFull;
    }
    this.hideMoney.set(ev.checked);
  }
}
