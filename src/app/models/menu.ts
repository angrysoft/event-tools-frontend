import { Day, WorkerDaySchedule, WorkerSchedule } from "./schedule";

interface MenuAction {
  action: string;
  data: string | number | WorkerDaySchedule | DayId | WorkerAction ;
}

interface DayId {
  id: number;
}

interface WorkerAction {
  worker: WorkerSchedule;
  data: Day;
}

export { DayId, MenuAction, WorkerAction };

