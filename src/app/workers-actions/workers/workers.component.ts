import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatTable, MatTableModule } from "@angular/material/table";
import { WorkersDataSource } from "./workers-datasource";
import { WorkersItem } from "../../models/worker-item";
import { WorkersService } from "../../services/workers.service";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
  selector: "app-workers",
  templateUrl: "./workers.component.html",
  styleUrl: "./workers.component.scss",
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
})
export class WorkersComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable) table!: MatTable<WorkersItem>;
  dataSource!: WorkersDataSource;
  displayedColumns = ["id", "firstName", "lastName"];

  constructor(private workerService: WorkersService) {}

  ngOnInit(): void {
    this.dataSource = new WorkersDataSource(this.workerService);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
    this.dataSource.loadData();
  }
}
