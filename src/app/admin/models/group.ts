import { FormControl } from "@angular/forms";

interface Group {
  id: number;
  name: string;
  sort: number;
}

interface GroupForm {
  id: FormControl<number | null>;
  name: FormControl<string | null>;
  sort: FormControl<number | null>;
}

export { Group, GroupForm };
