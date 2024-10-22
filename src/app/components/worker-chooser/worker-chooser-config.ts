import { WorkerBase } from "../../admin/models/worker";

export interface WorkerChooserConfig {
  single: boolean;
  search: boolean;
  data: Set<WorkerBase>;
}
