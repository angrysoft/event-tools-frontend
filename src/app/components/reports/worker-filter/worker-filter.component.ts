import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-worker-filter',
  imports: [MatDialogModule, MatListModule, MatButtonModule],
  templateUrl: './worker-filter.component.html',
  styleUrl: './worker-filter.component.scss'
})
export class WorkerFilterComponent {
  readonly data = inject(MAT_DIALOG_DATA);
}
