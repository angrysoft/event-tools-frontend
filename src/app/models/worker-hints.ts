interface WorkerHints {
  teams: Team[];
  groups: Group[];
  authorities: Authority[];
}

interface Team {
  id: number;
  name: string;
  sort: number;
}

interface Group {
  id: number;
  name: string;
  sort: number;
}

interface Authority {
  name: string;
  value: string;
}

export { WorkerHints, Team, Group };
