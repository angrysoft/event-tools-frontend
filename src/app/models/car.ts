import { FormControl } from "@angular/forms";

interface Car {
  id: number;
  workerId: number;
  name: string;
  registration: string;
  carDoc: CarDoc[];
  company: false;
}

interface CarDoc {
  id: number | null;
  name: string | null;
  fileName: string | null;
  car: number | null;
  hasExpirationDate: boolean | null;
  expire?: Date | string | null;
}

interface CarForm {
  id: FormControl<number | null>;
  workerId: FormControl<number | null>;
  name: FormControl<string | null>;
  registration: FormControl<string | null>;
}

export { Car, CarForm, CarDoc };
