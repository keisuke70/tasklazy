export interface Task {
  id: string;
  user_id: string;
  name: string;
  duration: number;
  due_date: string | null; // ISO date string (YYYY-MM-DD)
  reminder_time: string | null; // ISO datetime string
  repeat_rule: RepeatOption;
  is_complete: boolean;
  priority: number | null;
}


export interface ScheduledBlock {
  taskId: string;
  priority: number;
  startTime: string;
}

export enum RepeatOption {
  None = "None",
  Daily = "Daily",
  Weekly = "Weekly",
  Monthly = "Monthly",
}