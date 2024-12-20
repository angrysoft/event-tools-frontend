interface Schedule {
  workerSchedules: WorkerSchedule[];
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
  dayOff: boolean;
  accepted: boolean;
}

interface Day {
  date: string;
  day: number;
  weekName: string;
}

interface ScheduleAction {
  action: "worker" | "event" | "goto";
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
