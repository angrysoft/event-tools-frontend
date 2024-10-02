import { Component, input, output } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatOptionModule } from "@angular/material/core";
import { MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInput } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { SearchQuery, Filter } from "./model";

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
    MatOptionModule,
    MatSelectModule,
  ],
  templateUrl: "./search.component.html",
  styleUrl: "./search.component.scss",
})
export class SearchComponent {
  searchRequest = output<SearchQuery>();
  resetSearch = output();
  filters = input<Filter[]>();

  searchForm: FormGroup = new FormGroup({
    query: new FormControl("", {
      nonNullable: true,
      // validators: [Validators.required, Validators.minLength(3)],
    }),
    filter: new FormControl(""),
  });

  onSearch() {
    if (this.searchForm.status !== "VALID") return;
    this.searchRequest.emit(this.searchForm.value);
  }

  onFilterSet() {
    if (this.searchForm.get("filter")?.value === "none") this.onReset();
    this.searchRequest.emit(this.searchForm.value);
  }

  onReset() {
    if (!this.searchForm.dirty) return;

    this.resetSearch.emit();
    this.searchForm.reset();
  }
}
