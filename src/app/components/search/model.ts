import { FormControl, FormRecord } from "@angular/forms";

interface Filter {
  name: string;
  values: FilterItem[];
}

interface FilterItem {
  name: string;
  value: string;
}

interface SearchQuery {
  [key: string]: string;
}

interface SearchQueryForm {
  query: FormControl<string>;
  filters: FormRecord;
}

interface InputFilters {
  [key: string]: Filter;
}

export { SearchQuery, InputFilters, SearchQueryForm, FilterItem };
