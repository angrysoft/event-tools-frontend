import { KeyValuePipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-expired-car-docs-list",
  imports: [RouterLink, MatDialogModule, MatButtonModule, KeyValuePipe],
  templateUrl: "./expired-car-docs-list.component.html",
  styleUrl: "./expired-car-docs-list.component.scss",
})
export class ExpiredCarDocsListComponent {
  readonly data = inject(MAT_DIALOG_DATA);
}
