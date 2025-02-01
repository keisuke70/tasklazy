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
          value={task.reminderTime}
          onChange={(value) => handleFieldChange("reminderTime", value)}
        />
      </TableCell>
      <TableCell>
        <TaskRepeatField
          value={task.repeatRule}
          onChange={(value) => handleFieldChange("repeatRule", value)}
        />
      </TableCell>
      <TableCell
        className={
          task.dueDate && isPast(new Date(task.dueDate)) && !task.isComplete
            ? "text-red-500"
            : ""
        }
      >
        <TaskDateField
          value={task.dueDate}
          onChange={(value) => handleFieldChange("dueDate", value)}
        />
      </TableCell>
    </>
  );
}
