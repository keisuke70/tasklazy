export interface Task {
  id: string;
  name: string;
  duration: number; // Changed to number (minutes)
  dueDate?: string; // ISO date string (YYYY-MM-DD)
  reminderTime?: string; // ISO datetime string like
  repeatRule: RepeatOption;
  isComplete: boolean;
  priority?: number;
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