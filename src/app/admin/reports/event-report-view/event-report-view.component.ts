import { SelectionModel } from "@angular/cdk/collections";
import { DatePipe, KeyValuePipe } from "@angular/common";
import { Component, inject, signal, viewChild } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialog } from "@angular/material/dialog";
import { MatListOption } from "@angular/material/list";
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from "@angular/material/slide-toggle";
import { MatTable, MatTableModule } from "@angular/material/table";
import { ActivatedRoute } from "@angular/router";
import { ActionToolbarComponent } from "../../../components/action-toolbar/action-toolbar.component";
import { LoaderComponent } from "../../../components/loader/loader.component";
import { WorkerFilterComponent } from "../../../components/reports/worker-filter/worker-filter.component";
import { EventItemDto } from "../../../models/events";
import { Totals } from "../../../models/reports";
import { ReportsService } from "../../../services/reports.service";
import { WorkerDaysService } from "../../services/worker-days.service";
import { EventReportDataSource } from "./event-report-datasource";

@Component({
  selector: "app-event-report-view",
  imports: [
    LoaderComponent,
    ActionToolbarComponent,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    DatePipe,
    KeyValuePipe,
    MatSlideToggleModule,
  ],
  templateUrl: "./event-report-view.component.html",
  styleUrl: "./event-report-view.component.scss",
})
export class EventReportViewComponent {
  reportService = inject(ReportsService);
  workerDayService = inject(WorkerDaysService);
  route = inject(ActivatedRoute);
  dialog = inject(MatDialog);

  loading = signal<boolean>(true);
  statuses = signal<{ [key: string]: string }>({});
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
  totals = signal<Totals>({
    totalHours: 0,
    totalAddons: "",
    totalRates: "",
    total: ""
  })
  hideAmount = signal<boolean>(false);
  workerSelection = new SelectionModel<number>();
  workerList = signal<WorkerSelection[]>([]);
  eventId = Number(this.route.snapshot.paramMap.get("eventId") ?? -1);
  readonly table = viewChild.required(MatTable);
  dataSource!: EventReportDataSource;

  
  tableColumnsFull: { name: string; def: string }[] = [
    { name: "Start", def: "startTime" },
    { name: "Koniec", def: "endTime" },
    { name: "Godziny", def: "workHours" },
    { name: "Pracownik", def: "workerName" },
    { name: "Stawka", def: "rateName" },
    { name: "Kwota", def: "rateValue" },
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
    this.table().dataSource = this.dataSource;
  }

  get columnNames() {
    return this.tableColumns.map((el) => el.def);
  }

  getStatus(state: string) {
    return this.statuses()[state];
  }

  private loadDays() {
    this.reportService.getEventRaportForWorkers(this.eventId, this.workerSelection.selected).subscribe((resp) => {
      if (resp.ok) {
        this.eventInfo.set(resp.data.info);
        this.totals.set(resp.data.totals);
        const workers:any = {};
        const workerDays = [];
        for (const eventDay of resp.data.eventDays) {
          workerDays.push(...eventDay.workerDays.map(wd=>{
            wd.state = eventDay.state;
            if (wd.worker && wd.workerName && this.workerSelection.isEmpty()) {
              workers[wd.worker] = {id: wd.worker, workerName: wd.workerName};
            }
            return wd;
          }));
        }
        if (this.workerSelection.isEmpty())
          this.workerList.set(Object.values(workers));

        this.dataSource.loadData(workerDays);
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
    this.hideAmount.set(ev.checked);
  }

  filterWorkers() {
    const filterWorkersDialog = this.dialog.open(WorkerFilterComponent, {
      data: {workers: this.workerList()}
    });

    filterWorkersDialog.afterClosed().subscribe((result)=> {
      if (result) {
        this.workerSelection.select(result.map((v:MatListOption)=>v.value));
        this.loadDays();
      }
    });
  }
}

interface WorkerSelection {
  id: number;
  workerName: string;
}
