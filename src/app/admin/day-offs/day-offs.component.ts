import { SelectionModel } from "@angular/cdk/collections";
import {
  AfterViewInit,
  Component,
  inject,
  signal,
  viewChild,
} from "@angular/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { ActionToolbarComponent } from "../../components/action-toolbar/action-toolbar.component";
import { LoaderComponent } from "../../components/loader/loader.component";
import { InputFilters } from "../../components/search/model";
import { DayOff } from "../../models/schedule";
import { DayOffDataSource } from "./day-off-datasource";
import { MatTable, MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { WorkerDaysService } from "../../services/worker-days.service";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "../../components/confirm-dialog/confirm-dialog.component";

@Component({
  selector: "app-day-offs",
  imports: [
    ActionToolbarComponent,
    MatCheckboxModule,
    LoaderComponent,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
  ],
  templateUrl: "./day-offs.component.html",
  styleUrl: "./day-offs.component.scss",
})
export class DayOffsComponent implements AfterViewInit {
  selection = new SelectionModel<DayOff>(true, [], true);
  private readonly service = inject(WorkerDaysService);
  inputFilters = signal<InputFilters>({});
  tableColumns = [
    { name: "selection", def: "select" },
    { name: "Id", def: "id" },
    { name: "Data", def: "date" },
    { name: "Pracownik", def: "workerName" },
  ];

  readonly paginator = viewChild.required(MatPaginator);
  readonly table = viewChild.required(MatTable);
  dataSource!: DayOffDataSource;
  private readonly dialog = inject(MatDialog);

  constructor() {
    this.dataSource = new DayOffDataSource(this.service);
  }

  get columnNames() {
    return this.tableColumns.map((el) => el.def);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator();
    this.table().dataSource = this.dataSource;
  }

  isSelected(row: DayOff) {
    return this.selection.selected.some((el) => el.id === row.id);
  }

  acceptDays() {
    const acceptDialog = this.dialog.open(ConfirmDialogComponent, {
      data: { msg: "Czy na pewno zaakceptować ?" },
    });
    acceptDialog.afterClosed().subscribe((result) => {
      if (result && result === true) {
        this.service
          .acceptDayOffs(this.selection.selected.map((d) => d.id))
          .subscribe((resp) => {
            if (resp.ok) {
              this.paginator().firstPage();
              this.dataSource.loadData();
            } else this.service.showError(resp);
          });
      }
    });
  }

  deleteDays() {
    const delDialog = this.dialog.open(ConfirmDialogComponent, {
      data: { msg: "Czy na pewno usunąć ?" },
    });
    delDialog.afterClosed().subscribe((result) => {
      if (result && result === true) {
        this.service
          .removeDayOffs(this.selection.selected.map((d) => d.id))
          .subscribe((resp) => {
            if (resp.ok) {
              this.paginator().firstPage();
              this.dataSource.loadData();
            } else this.service.showError(resp);
          });
      }
    });
  }
}
