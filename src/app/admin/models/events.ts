import { FormControl } from "@angular/forms";

interface Event {
  id: number;
  name: string;
  number: string;
  description: string;
  coordinatorId: number;
  accountManagerId: number;
  chiefId: number;
}

interface EventForm {
  id: FormControl<number | null>;
  name: FormControl<string | null>;
  number: FormControl<string | null>;
  description: FormControl<string | null>;
  coordinatorId: FormControl<number | null>;
  accountManagerId: FormControl<number | null>;
  chiefId: FormControl<number | null>;
}

export { Event, EventForm };
