"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow as UiTableRow,
} from "@/components/ui/table";
import TaskRow from "./TaskRow";
import { Task } from "@/lib/definition";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Bell, Repeat } from "lucide-react";

interface TaskListTableProps {
  tasks: Task[];

  /**
   * Called when a task’s fields (e.g. name, dueDate) have changed
   * Expects the entire updated Task object
   */
  onUpdateTask: (updatedTask: Task) => void;

  /**
   * Called when the user toggles completion on a task
   */
  onToggleComplete: (taskId: string) => void;

  /**
   * Called when the user sets a scheduling priority
   */
  onSetPriority: (taskId: string, priority: number) => void;
}

export default function TaskListTable({
  tasks,
  onUpdateTask,
  onToggleComplete,
  onSetPriority,
}: TaskListTableProps) {
  return (
    <Table>
      <TableHeader>
        <UiTableRow>
          <TooltipProvider>
            <TableHead className="w-[50px]">Done</TableHead>
            <TableHead>Task Name</TableHead>
            <TableHead>Time Required</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>
              Reminder{" "}
              <Tooltip>
                <TooltipTrigger>
                  <Bell className="h-4 w-4 ml-2 inline-block" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reminder</p>
                </TooltipContent>
              </Tooltip>
            </TableHead>
            <TableHead>
              Repeat
              <Tooltip>
                <TooltipTrigger>
                  <Repeat className="h-4 w-4 ml-2 inline-block" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Repeat Rule</p>
                </TooltipContent>
              </Tooltip>
            </TableHead>
          </TooltipProvider>
        </UiTableRow>
      </TableHeader>

      <TableBody>
        {tasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            onUpdateTask={onUpdateTask}
            onToggleComplete={onToggleComplete}
            onSetPriority={onSetPriority}
          />
        ))}
      </TableBody>
    </Table>
  );
}
