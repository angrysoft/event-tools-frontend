import {
  Component,
  effect,
  inject,
  input,
  signal,
  untracked
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialog } from "@angular/material/dialog";
import { MatIcon } from "@angular/material/icon";
import { RouterLink } from "@angular/router";
import { AddButtonComponent } from "../../../components/add-button/add-button.component";
import { ConfirmDialogComponent } from "../../../components/confirm-dialog/confirm-dialog.component";
import { WorkerDoc } from "../../models/worker-doc";
import { DocsService } from "../../services/docs.service";

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
export class DocsComponent {
  readonly confirm = inject(MatDialog);
  // readonly router = inject(Router);
  workerId = input.required<number>();
  readonly docService = inject(DocsService);
  workerDocs = input.required<WorkerDoc[]>();
  docList = signal<WorkerDoc[]>([]);

  constructor() {
    effect(() => {
      const list = this.workerDocs();
      untracked(() => {
        if (list) this.docList.set(list);
      });
    });
  }

  getFile(id: number | null) {
    console.log("get file " + id);
  }

  removeFile(docId: number | null) {
    if (!docId) {
      console.warn("Brakuje doc id");
      return;
    }

    const dialogRef = this.confirm.open(ConfirmDialogComponent, {
      data: { msg: "Czy na pewno chcesz usunąć ?" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.docService.deleteDoc(this.workerId(), docId).subscribe((response) => {
          if (response.ok) {
            this.docList.set(
              this.docList().filter((doc) => doc.id !== docId),
            );
          } else this.docService.showError(response);
        });
      }
    });
  }
}
