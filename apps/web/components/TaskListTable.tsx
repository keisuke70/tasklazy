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
import { Menu, Bell, Repeat, Clock, CalendarCheck } from "lucide-react";
import TaskRow from "./TaskRow";
import { Task } from "@/lib/definition";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TaskListTableProps {
  tasks: Task[];
  onUpdateTask: (updatedTask: Task) => void;
  onToggleComplete: (taskId: string) => void;
  // Updated to allow clearing the priority by passing undefined.
  onSetPriority: (taskId: string, priority?: number) => void;
}

export default function TaskListTable({
  tasks,
  onUpdateTask,
  onToggleComplete,
  onSetPriority,
}: TaskListTableProps) {
  // Controls whether we show extra columns (edit mode)
  const [editDetails, setEditDetails] = useState(false);

  // Toggles the extra columns
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
              {/* Always-visible columns: Done, Task Name */}
              <UiTableHead className="w-[60px] text-center">Done</UiTableHead>
              <UiTableHead className="min-w-[300px]">Task Name</UiTableHead>

              {/* Conditionally visible columns */}
              {editDetails && (
                <>
                  <UiTableHead className="w-[80px]">
                    Duration
                    <Clock className="h-4 w-4 ml-2 inline-block" />
                  </UiTableHead>
                  <UiTableHead className="w-[160px]">
                    Reminder <Bell className="h-4 w-4 ml-2 inline-block" />
                  </UiTableHead>
                  <UiTableHead className="w-[120px]">
                    Repeat <Repeat className="h-4 w-4 ml-2 inline-block" />
                  </UiTableHead>
                  <UiTableHead className="w-[140px]">
                    Due <CalendarCheck className="h-4 w-4 ml-2 inline-block" />
                  </UiTableHead>
                </>
              )}

              <UiTableHead className="w-[60px] text-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={toggleColumns}
                      className="inline-flex items-center justify-center p-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-gray-300"
                      aria-label="Toggle columns"
                    >
                      <Menu className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{editDetails ? "Close Edit Mode" : "Edit Mode"}</p>
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
              onSetPriority={onSetPriority}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
