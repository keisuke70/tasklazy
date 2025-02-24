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
    <div className="flex items-center gap-4 text-muted-foreground text-sm cursor-default">
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
      {task.reminder_time && (
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Bell className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>Reminder</TooltipContent>
          </Tooltip>
          <FormattedDateTime isoString={task.reminder_time} />
        </div>
      )}
      {task.repeat_rule && task.repeat_rule !== RepeatOption.None && (
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Repeat className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>Repeat</TooltipContent>
          </Tooltip>
          {task.repeat_rule}
        </div>
      )}
      {task.due_date && (
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <CalendarCheck className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>Due Date</TooltipContent>
          </Tooltip>
          <FormattedDateTime isoString={task.due_date} />
        </div>
      )}
    </div>
  );
}
