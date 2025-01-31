"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow as UiTableRow,
  TableHead as UiTableHead,
} from "@/components/ui/table";
import { Menu } from "lucide-react";
import TaskRow from "./TaskRow";
import { Task } from "@/lib/definition";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Bell, Repeat, Clock, CalendarCheck } from "lucide-react";

interface TaskListTableProps {
  tasks: Task[];
  onUpdateTask: (updatedTask: Task) => void;
  onToggleComplete: (taskId: string) => void;
  onSetPriority: (taskId: string, priority: number) => void;
}

export default function TaskListTable({
  tasks,
  onUpdateTask,
  onToggleComplete,
  onSetPriority,
}: TaskListTableProps) {
  // Controls whether we show extra columns
  const [editDetails, setEditDetails] = useState(false);

  // Toggles the detail columns
  const toggleColumns = () => {
    setEditDetails((prev) => !prev);
  };

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        {/* TABLE HEADER */}
        <TableHeader>
          <UiTableRow>
            <TooltipProvider>
              {/* 1. Always-visible columns: Done, Task Name */}
              <UiTableHead className="w-[60px] text-center">Done</UiTableHead>
              <UiTableHead>Task Name</UiTableHead>

              {/* 2. Conditionally visible columns */}
              {editDetails && (
                <>
                  <UiTableHead>
                    Duration
                    <Clock className="h-4 w-4 ml-2 inline-block" />
                  </UiTableHead>
                  <UiTableHead>
                    Due <CalendarCheck className="h-4 w-4 ml-2 inline-block" />
                  </UiTableHead>
                  <TableHead>
                    Reminder <Bell className="h-4 w-4 ml-2 inline-block" />
                  </TableHead>
                  <TableHead>
                    Repeat <Repeat className="h-4 w-4 ml-2 inline-block" />
                  </TableHead>
                </>
              )}

              <UiTableHead className="w-[60px] text-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={toggleColumns}
                      className="inline-flex items-center justify-center p-2
                                 bg-gray-100 rounded hover:bg-gray-200 transition-colors
                                 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-gray-300"
                      aria-label="Toggle columns"
                    >
                      <Menu className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {editDetails
                        ? "Hide Extra Columns"
                        : "Show Extra Columns"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </UiTableHead>
            </TooltipProvider>
          </UiTableRow>
        </TableHeader>

        {/* TABLE BODY */}
        <TableBody>
          {tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              editDetails={editDetails}
              onUpdateTask={onUpdateTask}
              onToggleComplete={onToggleComplete}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
