export interface RestResponse<T> {
  ok: boolean;
  error: string | null;
  data: T
}