export interface Routine {
  id: string;
  title: string;
  startDate: string;
  checkDates: string[];
  isCompleted: boolean;
}

export interface RoutineCheck {
  routineId: string;
  date: string;
}
