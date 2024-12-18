import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';

@Component({
  selector: "app-expired-dosc-list",
  imports: [RouterLink, MatDialogModule, MatButtonModule],
  templateUrl: "./expired-dosc-list.component.html",
  styleUrl: "./expired-dosc-list.component.scss",
})
export class ExpiredDoscListComponent {
  readonly data = inject(MAT_DIALOG_DATA);

}
