export interface WorkerDetails {
  id: number;
  firstName: string;
  lastName: string;
  secondName?: string;
  phone: string;
  email: string;
  nickname: string | null;
  color: string | null;
  username: string | null;
  teamId: number | null;
  groupId: number | null;
  pesel?: string;
  docNumber?: string;
  hasAccount: boolean;
}