import { Component, EventEmitter, Output } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
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
  @Output()
  searchRequest = new EventEmitter<string>();

  @Output()
  resetSearch = new EventEmitter();

  searchForm: FormGroup = new FormGroup({
    search: new FormControl(""),
  });

  onSearch() {
    const queryField = this.searchForm.get("search");
    
    console.log("search ", queryField?.value);

    if (queryField?.value && queryField.valid) {
      this.searchRequest.emit(queryField.value);
    }
  }

  onReset() {
    if (!this.searchForm.dirty)
      return;

    this.resetSearch.emit();
    this.searchForm.reset();
  }
}
