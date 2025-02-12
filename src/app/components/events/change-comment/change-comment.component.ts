import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

@Component({
  selector: "app-change-comment",
  imports: [
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
  ],
  templateUrl: "./change-comment.component.html",
  styleUrl: "./change-comment.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangeCommentComponent {
  changeCommentForm: FormGroup<ChangeCommentForm>;
  data = inject(MAT_DIALOG_DATA);

  constructor() {
    this.changeCommentForm = new FormGroup<ChangeCommentForm>({
      comment: new FormControl(this.data.comment, Validators.required),
    });
  }
}

interface ChangeCommentForm {
  comment: FormControl<string | null>;
}
