export interface Task {
  id: string;
  name: string;
  timeRequired?: string; // e.g. "1h", "30m"
  dueDate?: string; // e.g. "2025-02-10"
  reminderTime?: string; // e.g. "2025-02-09T10:00"
  repeatRule?: string; // e.g. "Weekly Wed"
  isComplete: boolean;
  priority?: number; // Not stored by default, assigned only for scheduling
}


export interface ScheduledBlock {
  taskId: string;
  priority: number;
  startTime: string; // e.g. "2025-02-10T09:00"
  endTime: string; // e.g. "2025-02-10T10:00"
}
