"use client";

import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { TableCell, TableRow as UiTableRow } from "@/components/ui/table";
import type { Task } from "@/lib/definition";
import TaskNameCell from "./TaskNameCell";
import TaskIcons from "./TaskIcons";
import TaskEditFields from "./TaskEditFields";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TaskEditModalContent } from "./TaskEditModalContent";

export interface TaskRowProps {
  task: Task;
  editDetails: boolean;
  onUpdateTask: (updatedTask: Task) => void;
  onToggleComplete: (taskId: string) => void;
  onSetPriority: (taskId: string, priority?: number) => void;
  onDeleteTask: (taskId: string) => void;
}

export default function TaskRow({
  task,
  editDetails,
  onUpdateTask,
  onToggleComplete,
  onSetPriority,
  onDeleteTask,
}: TaskRowProps) {
  const [tempTask, setTempTask] = useState<Task>(task);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

  const handleDelete = () => {
    onDeleteTask(task.id);
    setIsDeleteDialogOpen(false);
  };

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
    <>
      <UiTableRow className="hover:bg-[#f9f9f9]">
        <TableCell>
          <Checkbox
            checked={task.isComplete}
            onCheckedChange={() => onToggleComplete(task.id)}
            className="ml-3"
          />
        </TableCell>

        {/* Wrap the cell content in a Dialog so the modal is rendered via a portal */}
        <TableCell
          className={`py-3 ${!editDetails ? "cursor-pointer relative" : ""}`}
        >
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogTrigger asChild>
              <div className="flex flex-col">
                <TaskNameCell
                  value={tempTask.name}
                  editDetails={editDetails}
                  onChange={(newValue) => handleFieldChange("name", newValue)}
                />
                {!editDetails && (
                  <div>
                    <TaskIcons
                      task={tempTask}
                      formatDuration={formatDuration}
                    />
                  </div>
                )}
              </div>
            </DialogTrigger>
            <TaskEditModalContent
              task={tempTask}
              handleFieldChange={handleFieldChange}
            />
          </Dialog>
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
            <span className="text-lg font-bold text-primary flex justify-center">
              {tempTask.priority}
            </span>
          </TableCell>
        )}

        {editDetails && (
          <TaskEditFields
            task={tempTask}
            handleFieldChange={handleFieldChange}
          />
        )}

        <TableCell>
          <div className="flex h-full justify-center items-center">
            <Dialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
            >
              <DialogTrigger asChild>
                <button type="button" className="focus:outline-none">
                  <DeleteOutlinedIcon sx={{ color: "#ab003c" }} />
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Deletion</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this task permanently? This
                    action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDeleteDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDelete}>
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </TableCell>
      </UiTableRow>
    </>
  );
}
