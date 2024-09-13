export interface Worker {
  id: number | null;
  firstName: string | null;
  lastName: string | null;
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
