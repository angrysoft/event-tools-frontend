import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTable, MatTableModule } from "@angular/material/table";
import { SearchComponent } from "../../components/search/search.component";
import { WorkersItem } from "../../models/worker-item";
import { WorkersService } from "../../services/workers.service";
import { WorkersDataSource } from "./workers-datasource";
import { Router, RouterLink } from "@angular/router";

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
  ],
})
export class WorkersComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable) table!: MatTable<WorkersItem>;
  dataSource!: WorkersDataSource;
  displayedColumns = ["id", "firstName", "lastName"];

  constructor(private workerService: WorkersService, private router: Router) {}

  ngOnInit(): void {
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

  onDbClick(row: any) {
    console.log("clicked", row);
    this.router.navigateByUrl(`/workers/${row.id}`);
  }
}
