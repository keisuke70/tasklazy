export interface Task {
  id: number;
  text: string;
  timeToComplete?: number;
  preferredTime: "none" | "morning" | "noon" | "night";
  selectedDates: DateWithPriority[];
  dueDate?: Date | null;
  recurringSettings: "none" | "daily" | "weekly" | "monthly";
  categoryId: string;
}

export interface Category {
  id: string; // UUID
  name: string;
  color: string;
  defaultTime: number;
  preferredTime: "none" | "morning" | "noon" | "night";
}

export interface DateWithPriority {
  date : Date;
  priority: number;
}