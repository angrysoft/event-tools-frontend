import { FormControl } from "@angular/forms";

interface Car {
  id: number | null;
  workerId: number;
  name: string;
  registration: string;
  carDoc?: CarDoc[];
  company: boolean;
}

interface CarDoc {
  id: number | null;
  name: string | null;
  fileName: string | null;
  car: number | null;
  expirationDate: boolean | null;

  expire?: Date | string | null;
}

interface CarDocData extends CarDoc {
  expirationDate: boolean | null;
  file: File | null;
}

interface CarForm {
  id: FormControl<number | null>;
  workerId: FormControl<number | null>;
  name: FormControl<string | null>;
  registration: FormControl<string | null>;
  company: FormControl<boolean | null>;
}

interface CarDocForm {
  id: FormControl<number | null>;
  car: FormControl<number | null>;
  name: FormControl<string | null>;
  expirationDate: FormControl<boolean | null>;
  expire: FormControl<Date | string | null>;
  file: FormControl<File | null>;
}

export { Car, CarDoc, CarDocData, CarDocForm, CarForm };
