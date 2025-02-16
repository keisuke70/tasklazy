"use client";

import { Input } from "@/components/ui/input";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import TaskTimeField from "./fields/TaskTimeField";
import TaskDateTimeField from "./fields/TaskDateTimeField";
import TaskRepeatField from "./fields/TaskRepeatField";
import TaskDateField from "./fields/TaskDateField";
import { Task } from "@/lib/definition";
import { Clock, Bell, Repeat, CalendarCheck, X } from "lucide-react";
import BorderColorIcon from "@mui/icons-material/BorderColor";
interface TaskEditModalContentProps {
  task: Task;
  handleFieldChange: <K extends keyof Task>(field: K, value: Task[K]) => void;
}

export function TaskEditModalContent({
  task,
  handleFieldChange,
}: TaskEditModalContentProps) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
          Edit Details
          <BorderColorIcon fontSize="small" />
        </DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-3">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Task Name</label>
          <Input
            type="text"
            value={task.name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Task name"
          />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <Clock className="h-5 w-5 text-muted-foreground" />
              Duration
            </label>
            <TaskTimeField
              value={task.duration}
              onChange={(value) => handleFieldChange("duration", value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <Repeat className="h-5 w-5 text-muted-foreground" />
              Repeat
            </label>
            <TaskRepeatField
              value={task.repeatRule}
              onChange={(value) => handleFieldChange("repeatRule", value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <Bell className="h-5 w-5 text-muted-foreground" />
              Reminder
            </label>
            <TaskDateTimeField
              value={task.reminderTime}
              onChange={(value) => handleFieldChange("reminderTime", value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <CalendarCheck className="h-5 w-5 text-muted-foreground" />
              Due Date
            </label>
            <TaskDateField
              value={task.dueDate}
              onChange={(value) => handleFieldChange("dueDate", value)}
            />
          </div>
        </div>
      </div>
    </DialogContent>
  );
}
