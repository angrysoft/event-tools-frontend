export interface WorkerRequest {
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  email: string | null;
  nickname: string | null;
  color: string | null;
  teamId: string | null;
  groupId: string | null;
  createAccount: boolean | null;
  username?: string;
  password?: string;
  password2?: string;
  authority?: string;
}

