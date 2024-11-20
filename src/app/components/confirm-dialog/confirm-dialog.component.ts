import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle
} from "@angular/material/dialog";

export interface DialogData {
  msg: string;
}

@Component({
    selector: "app-confirm-dialog",
    imports: [
        MatButtonModule,
        MatDialogTitle,
        MatDialogActions,
        MatDialogClose,
    ],
    templateUrl: "./confirm-dialog.component.html",
    styleUrl: "./confirm-dialog.component.scss"
})
export class ConfirmDialogComponent {
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
}
