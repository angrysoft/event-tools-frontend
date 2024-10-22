import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-download-dialog',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  templateUrl: './download-dialog.component.html',
  styleUrl: './download-dialog.component.scss'
})
export class DownloadDialogComponent {
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
}
