import { CommonModule } from "@angular/common";
import {
  AfterViewInit,
  Component,
  computed,
  input,
  output,
} from "@angular/core";
import {
  FormControl,
  FormRecord,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatOptionModule } from "@angular/material/core";
import { MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInput } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { InputFilters, SearchQuery } from "./model";

@Component({
  selector: "app-search",
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInput,
    MatLabel,
    MatIconModule,
    MatButtonModule,
    MatOptionModule,
    MatSelectModule,
    CommonModule,
  ],
  templateUrl: "./search.component.html",
  styleUrl: "./search.component.scss",
})
export class SearchComponent implements AfterViewInit {
  searchRequest = output<SearchQuery>();
  resetSearch = output();
  filters = input<InputFilters>();
  initValue = input<{ [key: string]: string }>({ query: "" });
  searchForm: FormRecord;
  inputFilters = computed(() => {
    const filters = this.filters();
    if (filters) {
      Object.keys(filters ?? {}).forEach((f) =>
        this.searchForm.setControl(
          f,
          new FormControl(this.initValue()[f] ?? null)
        )
      );
      return filters;
    }
    return {};
  });

  constructor() {
    this.searchForm = new FormRecord({
      query: new FormControl(this.initValue()["query"], {
        nonNullable: true,
        validators: [Validators.minLength(3)],
      }),
    });
  }

  ngAfterViewInit(): void {
    this.searchForm.controls["query"].setValue(this.initValue()["query"]);
    if (Object.keys(this.initValue()).length > 0) this.searchForm.markAsDirty();
  }

  onSearch() {
    if (this.searchForm.status !== "VALID" || !this.searchForm.dirty) return;
    const sendValue: { [key: string]: string } = this.removeNulls({
      ...this.searchForm.value,
    });
    this.searchRequest.emit(sendValue);
  }

  private removeNulls(value: { [x: string]: string | null }) {
    const cleaned: { [key: string]: string } = {};
    for (const [k, v] of Object.entries(value)) {
      if (v) cleaned[k] = v;
    }
    return cleaned;
  }

  onFilterSet() {
    this.onSearch();
  }

  onReset() {
    if (!this.searchForm.dirty) return;

    this.resetSearch.emit();
    this.searchForm.reset();
  }
}
