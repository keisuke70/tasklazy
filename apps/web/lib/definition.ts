export interface Task {
  id: string;
  name: string;
  duration?: number; // Changed to number (minutes)
  dueDate?: string; // ISO date string (YYYY-MM-DD)
  reminderTime?: string; // ISO datetime string
  repeatRule: RepeatOption;
  isComplete: boolean;
  priority?: number;
}

export interface ScheduledBlock {
  taskId: string;
  priority: number;
  startTime: string; // e.g. "09:00"
  endTime: string; // e.g. "10:00"
}

export enum RepeatOption {
  None = "None",
  Daily = "Daily",
  Weekly = "Weekly",
  Monthly = "Monthly",
}