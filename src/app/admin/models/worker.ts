interface WorkerBase {
  id: number | null;
  firstName: string | null;
  lastName: string | null;
}

interface Worker extends WorkerBase {
  secondName: string | null;
  phone: string | null;
  phoneIce: string | null;
  mother: string | null;
  father: string | null;
  email: string | null;
  nickname: string | null;
  color: string | null;
  username: string | null;
  teamId: number | null;
  groupId: number | null;
  pesel: string | null;
  docNumber: string | null;
  hasAccount: boolean | null;
  password?: string;
  password2?: string;
  authority?: string;
}

interface WorkersItem {
  firstName: string;
  lastName: string;
  id: number;
}

export { Worker, WorkerBase, WorkersItem };