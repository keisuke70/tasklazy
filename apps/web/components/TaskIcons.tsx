"use client";

import React from "react";
import { Clock, Bell, Repeat, CalendarCheck } from "lucide-react";
import { Task, RepeatOption } from "@/lib/definition";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import FormattedDateTime from "./FormattedDateTime";

interface TaskIconsProps {
  task: Task;
  formatDuration: (minutes?: number) => string;
}

export default function TaskIcons({ task, formatDuration }: TaskIconsProps) {
  return (
    <div className="flex items-center gap-4 text-muted-foreground text-sm select-none cursor-default">
      {task.duration && task.duration > 0 && (
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Clock className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>Duration</TooltipContent>
          </Tooltip>
          {formatDuration(task.duration)}
        </div>
      )}
      {task.reminderTime && (
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Bell className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>Reminder</TooltipContent>
          </Tooltip>
          <FormattedDateTime isoString={task.reminderTime} />
        </div>
      )}
      {task.repeatRule && task.repeatRule !== RepeatOption.None && (
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Repeat className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>Repeat</TooltipContent>
          </Tooltip>
          {task.repeatRule}
        </div>
      )}
      {task.dueDate && (
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <CalendarCheck className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>Due Date</TooltipContent>
          </Tooltip>
          <FormattedDateTime isoString={task.dueDate} />
        </div>
      )}
    </div>
  );
}
