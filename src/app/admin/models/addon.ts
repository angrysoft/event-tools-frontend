import { FormControl } from "@angular/forms";

interface Addon {
  id: number;
  name: string;
  addonType: string;
  value?: number;
}

interface AddonWorkDay {
  addon: number;
  name: string;
  addonType: string;
  value?: number;
}

interface AddonForm {
  id: FormControl<number | null>;
  name: FormControl<string | null>;
  addonType: FormControl<string | null>;
}

interface AddonType {
  name: string;
  value: string;
}

interface AddonValueDto {
  id: number;
  name: string;
  addonType: string;
  value: number;
}

interface AddonValueForm {
  id: FormControl<number | null>;
  workerId: FormControl<number | null>;
  addonId: FormControl<number | null>;
  value: FormControl<number | null>;
}

interface AddonValue {
  id?: number | null;
  workerId: number | null;
  addonId: number | null;
  value: number | null;
}

export {
  Addon,
  AddonForm,
  AddonType,
  AddonValueDto,
  AddonValueForm,
  AddonWorkDay,
  AddonValue,
};
