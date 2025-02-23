"use client";

import React from "react";
import { TableCell } from "@/components/ui/table";
import { Task, RepeatOption } from "@/lib/definition";
import TaskTimeField from "./fields/TaskTimeField";
import TaskDateTimeField from "./fields/TaskDateTimeField";
import TaskRepeatField from "./fields/TaskRepeatField";
import TaskDateField from "./fields/TaskDateField";
import { isPast } from "date-fns";

interface TaskEditFieldsProps {
  task: Task;
  handleFieldChange: <K extends keyof Task>(field: K, value: Task[K]) => void;
}

export default function TaskEditFields({
  task,
  handleFieldChange,
}: TaskEditFieldsProps) {
  return (
    <>
      <TableCell>
        <TaskTimeField
          value={task.duration}
          onChange={(value) => handleFieldChange("duration", value)}
        />
      </TableCell>
      <TableCell>
        <TaskDateTimeField
          value={task.reminder_time}
          onChange={(value) => handleFieldChange("reminder_time", value ?? null)}
        />
      </TableCell>
      <TableCell>
        <TaskRepeatField
          value={task.repeat_rule as RepeatOption}
          onChange={(value) => handleFieldChange("repeat_rule", value as RepeatOption)}
        />
      </TableCell>
      <TableCell
        className={
          task.due_date && isPast(new Date(task.due_date)) && !task.is_complete
            ? "text-red-500"
            : ""
        }
      >
        <TaskDateField
          value={task.due_date}
          onChange={(value) => handleFieldChange("due_date", value ?? null)}
        />
      </TableCell>
    </>
  );
}
