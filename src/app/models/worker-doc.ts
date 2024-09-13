export interface WorkerDoc {
  id: number | null;
  name: string | null;
  fileName: string | null;
  workerId: number | null;
  hasExpirationDate: boolean | null;
  expire: Date | null;
}
