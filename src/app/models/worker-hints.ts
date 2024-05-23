export interface WorkerHints {
  teams: Team[];
  groups: Group[];
  authorities: Authority[];
}

interface Team {
  id: number;
  name: string;
}

interface Group {
  id: number;
  name: string;
}

// interface Authority {
//   authority: string;
// }

type Authority = string;
