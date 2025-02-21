import { Component } from "@angular/core";
import {
  FormControl,
  ReactiveFormsModule
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";

@Component({
  selector: "app-accept-days",
  imports: [
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSlideToggleModule,
  ],
  templateUrl: "./accept-days.component.html",
  styleUrl: "./accept-days.component.scss",
})
export class AcceptDaysComponent {
  changeAll: FormControl<boolean | null>;

  constructor() {
    this.changeAll = new FormControl(false);
  }
}
