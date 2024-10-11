import { FormControl, FormRecord } from "@angular/forms";

interface Filter {
  name:string;
  values:string[]
}

interface SearchQuery {
  [key:string]: any
}

interface SearchQueryForm {
  query: FormControl<string>;
  filters: FormRecord;
}

interface InputFilters {
  [key:string]:Filter;
}

export { SearchQuery, InputFilters, SearchQueryForm };
