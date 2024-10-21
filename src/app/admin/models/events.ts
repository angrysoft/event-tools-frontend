import { FormControl } from "@angular/forms";

interface EventItem {
  id: number;
  name: string;
  number: string;
  description: string;
  coordinatorId: number;
  accountManagerId: number;
  chiefId: number;
}

interface EventItemForm {
  id: FormControl<number | null>;
  name: FormControl<string | null>;
  number: FormControl<string | null>;
  description: FormControl<string | null>;
  coordinatorId: FormControl<number | null>;
  accountManagerId: FormControl<number | null>;
  chiefId: FormControl<number | null>;
}

interface EventItemDto {
  id: number;
  name: string;
  number: string;
  description: string;
  coordinator: string;
  accountManager: string;
  chief: string;
  editors: string[]
  color: string;
}

export { EventItem, EventItemForm, EventItemDto };
