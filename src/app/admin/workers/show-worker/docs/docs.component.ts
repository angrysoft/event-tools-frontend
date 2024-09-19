import { Component, inject, input, OnInit, signal } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatDialog } from "@angular/material/dialog";
import { RouterLink } from "@angular/router";
import { ConfirmDialogComponent } from "../../../../components/confirm-dialog/confirm-dialog.component";
import { WorkerDoc } from "../../../models/worker-doc";
import { WorkersService } from "../../../services/workers.service";
import { MatButtonModule } from "@angular/material/button";
import { AddButtonComponent } from "../../../../components/add-button/add-button.component";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: "app-docs",
  standalone: true,
  imports: [
    MatCardModule,
    RouterLink,
    MatButtonModule,
    AddButtonComponent,
    MatIcon,
  ],
  templateUrl: "./docs.component.html",
  styleUrl: "./docs.component.scss",
})
export class DocsComponent implements OnInit {
  readonly confirm = inject(MatDialog);
  // readonly router = inject(Router);
  workerId = input.required<number>();
  readonly workerService = inject(WorkersService);
  workerDocs = signal<WorkerDoc[]>([]);

  ngOnInit(): void {
    this.workerService.getWorkersDocs(this.workerId()).subscribe((response) => {
      if (response.ok) {
        this.workerDocs.set(response.data);
      }
      console.log(this.workerDocs());
    });
  }

  getFile(id: number | null) {
    console.log("get file " + id);
  }

  removeFile(docId: number) {
    const dialogRef = this.confirm.open(ConfirmDialogComponent, {
      data: { msg: "Usnąć Pracownika jest to operacja nieodwracalna" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.workerService.delete(docId).subscribe((response) => {
          console.log(response);
          if (response.ok) {
            this.workerDocs.set(
              this.workerDocs().filter((doc) => doc.id !== docId),
            );
          }
        });
      }
    });
  }
}
