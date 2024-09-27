import { FormControl } from "@angular/forms";

interface Rate {
  id: number;
  name: string;
  rateType: string;
  overtimeAfter?: number;
}

interface RateForm {
  id: FormControl<number | null>;
  name: FormControl<string | null>;
  rateType: FormControl<string | null>;
  overtimeAfter: FormControl<number | null>;
}

interface RateType {
  name: string;
  value: string;
}

export { Rate, RateForm, RateType };
