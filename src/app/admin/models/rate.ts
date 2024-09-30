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

interface RateValue {
  rateValueId: number;
  name: string;
  rateType: string;
  overtimeAfter?: number;
  value: number;
  perHourOvertimeValue: number;
  perHourValue: number;
}

interface RateValueForm {
  id: FormControl<number | null>;
  workerId: FormControl<number | null>;
  rateId: FormControl<number | null>;
  perHourOvertimeValue: FormControl<number | null>;
  perHourValue: FormControl<number | null>;
  value: FormControl<number | null>;
}

export { Rate, RateForm, RateType, RateValue, RateValueForm };
