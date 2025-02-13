"use client";

import React, { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { TableCell, TableRow as UiTableRow } from "@/components/ui/table";
import { Task } from "@/lib/definition";
import TaskNameCell from "./TaskNameCell";
import TaskIcons from "./TaskIcons";
import TaskEditFields from "./TaskEditFields";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

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
          className="ml-3"
        />
      </TableCell>

      <TableCell
        className={`py-3 ${!editDetails ? "cursor-pointer relative" : ""}`}
      >
        <div className="flex flex-col">
          <TaskNameCell
            value={tempTask.name}
            editDetails={editDetails}
            onChange={(newValue) => handleFieldChange("name", newValue)}
          />
          {!editDetails && (
            <div>
              <TaskIcons task={tempTask} formatDuration={formatDuration} />
            </div>
          )}
        </div>
      </TableCell>

      {!editDetails && (
        <TableCell
          onClick={!editDetails ? handleRowClick : undefined}
          className={
            !editDetails
              ? "cursor-pointer hover:bg-gray-100 transition-colors py-2"
              : ""
          }
        >
          <span className="text-lg font-bold text-gray-700 flex justify-center">
            {tempTask.priority}
          </span>
        </TableCell>
      )}
      {editDetails && (
        <TaskEditFields task={tempTask} handleFieldChange={handleFieldChange} />
      )}

      <TableCell>
        <div className="flex h-full justify-center items-center">
          <button type="button" className="focus:outline-none">
            <DeleteOutlinedIcon sx={{ color: "#ab003c" }} />
          </button>
        </div>
      </TableCell>
    </UiTableRow>
  );
}
