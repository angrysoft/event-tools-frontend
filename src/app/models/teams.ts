import { GroupForm } from "./group";

interface Team {
  id: number;
  name: string;
  sort: number;
}

interface TeamForm extends GroupForm {}

export { Team, TeamForm };
