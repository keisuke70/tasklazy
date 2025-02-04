"use client";

import React, { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { TableCell, TableRow as UiTableRow } from "@/components/ui/table";
import { Task} from "@/lib/definition";
import { TooltipProvider } from "@/components/ui/tooltip";
import TaskNameCell from "./TaskNameCell";
import TaskIcons from "./TaskIcons";
import TaskEditFields from "./TaskEditFields";

export interface TaskRowProps {
  task: Task;
  editDetails: boolean;
  onUpdateTask: (updatedTask: Task) => void;
  onToggleComplete: (taskId: string) => void;
  onSetPriority: (taskId: string, priority?: number) => void;
}

export default function TaskRow({
  task,
  editDetails,
  onUpdateTask,
  onToggleComplete,
  onSetPriority,
}: TaskRowProps) {
  const [tempTask, setTempTask] = useState<Task>(task);

  useEffect(() => {
    setTempTask(task);
  }, [task]);

  const handleFieldChange = <K extends keyof Task>(
    field: K,
    value: Task[K]
  ) => {
    const updated = { ...tempTask, [field]: value };
    setTempTask(updated);
    onUpdateTask(updated);
  };

  // In non‑edit mode, clicking anywhere in this cell toggles selection.
  const handleRowClick = () => {
    if (editDetails) return;
    if (tempTask.priority !== undefined) {
      onSetPriority(task.id, undefined);
    } else {
      onSetPriority(task.id, 1);
    }
  };

  // Helper formatting functions.
  const formatDuration = (minutes?: number) => {
    if (!minutes) return "-";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return (
      [hours > 0 ? `${hours}h` : "", mins > 0 ? `${mins}m` : ""]
        .filter(Boolean)
        .join(" ") || "0m"
    );
  };

  return (
    <UiTableRow className="hover:bg-[#f9f9f9]">
      {/* "Done" column */}
      <TableCell>
        <Checkbox
          checked={task.isComplete}
          onCheckedChange={() => onToggleComplete(task.id)}
        />
      </TableCell>

      <TableCell
        className={`py-3 ${!editDetails ? "cursor-pointer relative" : ""}`}
        onClick={!editDetails ? handleRowClick : undefined}
      >
        <div className="flex flex-col">
          <TaskNameCell
            value={tempTask.name}
            editDetails={editDetails}
            onChange={(newValue) => handleFieldChange("name", newValue)}
            priority={tempTask.priority}
          />
          {!editDetails && (
            <div onClick={(e) => e.stopPropagation()}>
              <TooltipProvider>
                <TaskIcons
                  task={tempTask}
                  formatDuration={formatDuration}
                />
              </TooltipProvider>
            </div>
          )}
        </div>
        {!editDetails && tempTask.priority !== undefined && (
          <div className="absolute inset-0 bg-gray-200 bg-opacity-70 flex items-center justify-center pointer-events-none">
            <span className="text-lg font-bold text-gray-700">
              {tempTask.priority}
            </span>
          </div>
        )}
      </TableCell>

      {/* Extra editable fields appear in edit mode */}
      {editDetails && (
        <TaskEditFields task={tempTask} handleFieldChange={handleFieldChange} />
      )}
      <TableCell></TableCell>

    </UiTableRow>
  );
}
