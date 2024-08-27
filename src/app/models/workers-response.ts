export interface WorkersItem {
  firstName: string;
  lastName: string;
  id: number;
}

export interface WorkersResponse {
  items: WorkersItem[];
  count: number;
}
