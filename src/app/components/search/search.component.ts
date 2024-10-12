import {
  AfterViewInit,
  Component,
  effect,
  input,
  signal,
  OnInit,
  output,
  untracked,
  computed,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormRecord,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatOptionModule } from "@angular/material/core";
import { MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInput } from "@angular/material/input";
import { MatSelectChange, MatSelectModule } from "@angular/material/select";
import { SearchQuery, InputFilters, SearchQueryForm } from "./model";
import { CommonModule } from "@angular/common";

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
    CommonModule,
  ],
  templateUrl: "./search.component.html",
  styleUrl: "./search.component.scss",
})
export class SearchComponent implements AfterViewInit {
  searchRequest = output<SearchQuery>();
  resetSearch = output();
  filters = input<InputFilters>();
  searchForm: FormRecord;
  inputFilters = computed(() => {
    const filters = this.filters();
    if (filters) {
      Object.keys(filters ?? {}).forEach((f) =>
        this.searchForm.setControl(f, new FormControl(null)),
      );
      return filters;
    }
    return {};
  });

  constructor() {
    this.searchForm = new FormRecord({
      query: new FormControl("", {
        nonNullable: true,
        validators: [Validators.minLength(3)],
      }),
    });
  }

  ngAfterViewInit(): void {
    const filters = this.filters();
    Object.keys(filters ?? {}).forEach((f) =>
      this.searchForm.setControl(
        f,
        new FormControl("none") as FormControl<string>,
      ),
    );
  }

  onSearch() {
    if (this.searchForm.status !== "VALID" || !this.searchForm.dirty) return;
    const sendValue: { [key: string]: string } = this.removeNulls({
      ...this.searchForm.value,
    });
    this.searchRequest.emit(sendValue);
  }

  private removeNulls(value: { [x: string]: any }) {
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
