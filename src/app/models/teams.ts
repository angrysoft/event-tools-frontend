import { FormControl } from "@angular/forms";

interface Team {
  id: number;
  name: string;
  sort: number;
}

interface TeamForm {
  id: FormControl<number | null>;
  name: FormControl<string | null>;
  sort: FormControl<number | null>;
}

export { Team, TeamForm };
