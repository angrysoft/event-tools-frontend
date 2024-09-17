import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { ShowWorkerComponent } from "../../admin/workers/show-worker/show-worker.component";

export interface DialogData {
  msg: string;
}

@Component({
  selector: "app-confirm-dialog",
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  templateUrl: "./confirm-dialog.component.html",
  styleUrl: "./confirm-dialog.component.scss",
})
export class ConfirmDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ShowWorkerComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
}
