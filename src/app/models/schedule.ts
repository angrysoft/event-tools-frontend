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
  color: string | null;
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
  startTime: string | Date;
  endTime: string | Date;
  worker: number;
  color: string | null;
  dayOff: boolean;
  accepted: boolean;
  state: string;
  info: string | null;
}

interface Day {
  date: string;
  day: number;
  weekName: string;
}

interface ScheduleAction {
  action: "worker" | "event" | "goto";
  data: WorkerDaySchedule | ScheduleWorkerId;
}

interface ScheduleWorkerId {
  workerId: number
}

export {
  Schedule,
  WorkerSchedule,
  ScheduleWorkerId,
  WorkerDaySchedule,
  Day,
  ScheduleAction,
  DayOff,
};
