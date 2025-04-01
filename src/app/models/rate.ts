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

interface RateId {
  rateId: number;
  workerId: number;
}

interface RateValueDto extends RateId {
  id: number;
  rateName: string;
  rateType: string;
  overtimeAfter?: number;
  value: number;
  perHourOvertimeValue: number;
  perHourValue: number;
  overtimeAddonValue: number;
}

interface RateValueForm {
  id: FormControl<number | null>;
  workerId: FormControl<number | null>;
  rateId: FormControl<number | null>;
  perHourOvertimeValue: FormControl<number | null>;
  overtimeAddonValue: FormControl<number | null>;
  perHourValue: FormControl<number | null>;
  value: FormControl<number | null>;
}

interface RateValue {
  id: number | null;
  workerId: number | null;
  rateId: number | null;
  perHourOvertimeValue: number | null;
  perHourValue: number | null;
  overtimeAddonValue: number | null;
  value: number | null;
}

interface BasicPayForm {
  workers: FormControl<number | null>;
  value: FormControl<number | null>;
}

interface BasicPayData {
  workers: number | null;
  value: number | null;
}

export {
  BasicPayData,
  BasicPayForm,
  Rate,
  RateForm,
  RateType,
  RateValue,
  RateValueDto,
  RateValueForm,
  RateId as RateValueNamesDto,
};
