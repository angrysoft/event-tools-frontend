interface Schedule {
  workerSchedules: WorkerSchedule[];
  count: number;
  offset: number;
  size: number;
  days: Day[];
}

interface WorkerSchedule {
  workerName: string;
  days: {
    [key: string]: WorkerDaySchedule[];
  };
}

interface WorkerDaySchedule {
  id: number;
  eventId: number;
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

export { Schedule, WorkerSchedule, WorkerDaySchedule, Day };
