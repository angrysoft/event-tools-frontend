interface Schedule {
  workerSchedules: WorkerSchedule[];
  count: number;
  offset: number;
  size: number;
  total: number;
  days: Day[];
}

interface WorkerSchedule {
  id: number;
  workerName: string;
  color: string;
  days: {
    [key: string]: WorkerDaySchedule[];
  };
  dayOffs: DayOff[];
}

interface DayOff {
  id: number;
  worker: number;
  accepted: boolean;
}

interface WorkerDaySchedule {
  id: number;
  eventId: number;
  eventDay: number;
  eventName: string;
  startDate: string;
  worker: number;
  color: string;
}

interface Day {
  date: string;
  day: number;
  weekName: string;
}

interface ScheduleAction {
  action: "worker" | "event";
  data: WorkerDaySchedule | { workerId: number };
}

export {
  Schedule,
  WorkerSchedule,
  WorkerDaySchedule,
  Day,
  ScheduleAction,
  DayOff,
};
