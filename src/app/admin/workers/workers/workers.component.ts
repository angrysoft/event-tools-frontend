import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTable, MatTableModule } from "@angular/material/table";
import { SearchComponent } from "../../../components/search/search.component";
import { WorkersService } from "../../../services/workers.service";
import { WorkersDataSource } from "./workers-datasource";
import { Router, RouterLink } from "@angular/router";
import { AddButtonComponent } from "../../../components/add-button/add-button.component";
import { WorkersItem } from "../../../models/worker";

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
    MatFormFieldModule,
    SearchComponent,
    RouterLink,
    AddButtonComponent,
  ],
})
export class WorkersComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable) table!: MatTable<WorkersItem>;
  dataSource!: WorkersDataSource;
  displayedColumns = ["id", "firstName", "lastName"];

  readonly router = inject(Router);
  readonly workerService = inject(WorkersService);

  constructor() {
    this.dataSource = new WorkersDataSource(this.workerService);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
    this.dataSource.loadData();
  }

  searchQuery(query: any) {
    this.dataSource.query = query;
    this.dataSource.loadData();
  }

  resetSearch() {
    this.paginator.firstPage();
    this.dataSource.query = "";
    this.dataSource.loadData();
  }

  onClick(row: any) {
    this.router.navigateByUrl(`/admin/workers/${row.id}`);
  }
}
