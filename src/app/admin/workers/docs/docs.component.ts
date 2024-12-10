import {
  Component,
  effect,
  inject,
  input,
  signal,
  untracked,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialog } from "@angular/material/dialog";
import { MatIcon } from "@angular/material/icon";
import { RouterLink } from "@angular/router";
import { ConfirmDialogComponent } from "../../../components/confirm-dialog/confirm-dialog.component";
import { WorkerDoc } from "../../../models/worker-doc";
import { DocsService } from "../../services/docs.service";

@Component({
  selector: "app-docs",
  imports: [MatCardModule, RouterLink, MatButtonModule, MatIcon],
  templateUrl: "./docs.component.html",
  styleUrl: "./docs.component.scss",
})
export class DocsComponent {
  readonly confirm = inject(MatDialog);
  readonly docService = inject(DocsService);
  workerId = input.required<number>();
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
        this.docService
          .deleteDoc(this.workerId(), docId)
          .subscribe((response) => {
            if (response.ok) {
              this.docList.set(
                this.docList().filter((doc) => doc.id !== docId)
              );
            } else this.docService.showError(response);
          });
      }
    });
  }
}
