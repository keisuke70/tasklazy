"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
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
import { cn } from "@/lib/utils";

interface TaskListTableProps {
  tasks: Task[];
  onUpdateTask: (updatedTask: Task) => void;
  onToggleComplete: (taskId: string) => void;
  // Updated to allow clearing the priority by passing undefined.
  onSetPriority: (taskId: string, priority?: number) => void;
  editDetails: boolean;
  setEditDetails: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TaskListTable({
  tasks,
  onUpdateTask,
  onToggleComplete,
  onSetPriority,
  editDetails,
  setEditDetails,
}: TaskListTableProps) {
  const toggleColumns = () => {
    setEditDetails((prev) => !prev);
  };
  return (
    <div
      className={cn(
        "h-full overflow-auto relative mt-2 ml-3 border border-accent rounded-lg",
        {
          "ml-16": !editDetails,
        }
      )}
    >
      <Table className="relative">
        {/* TABLE HEADER */}
        <TableHeader className="sticky top-0 bg-white z-10">
          <UiTableRow>
            <TooltipProvider>
              <UiTableHead className="w-[60px] text-center">Done</UiTableHead>
              <UiTableHead className="min-w-[250px]">Task Name</UiTableHead>
              {editDetails && (
                <>
                  <UiTableHead className="w-[80px]">
                    Duration <Clock className="h-4 w-4 ml-2 inline-block" />
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
