import { FormControl } from "@angular/forms";

interface Group {
  id: number;
  name: string;
  sort: number;
}

interface GroupFrom {
  id: FormControl<number | null>;
  name: FormControl<string | null>;
  sort: FormControl<number | null>;
}

export { Group, GroupFrom };
