import { Component, output } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInput } from "@angular/material/input";

@Component({
  selector: "app-search",
  standalone: true,
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInput,
    MatLabel,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: "./search.component.html",
  styleUrl: "./search.component.scss",
})
export class SearchComponent {
  searchRequest = output<string>();
  resetSearch = output();

  searchForm: FormGroup = new FormGroup({
    search: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
  });

  onSearch() {
    if (this.searchForm.status !== "VALID") return;
    this.searchRequest.emit(this.searchForm.controls["search"].value);
  }

  onReset() {
    if (!this.searchForm.dirty) return;

    this.resetSearch.emit();
    this.searchForm.reset();
  }
}
