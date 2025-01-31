"use client";

import React, { useState } from "react";
import { format, isPast } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow as UiTableRow } from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Task } from "@/lib/definition";

export interface TaskRowInternalProps {
  task: Task;

  /**
   * Called when the user updates any field (name, dueDate, etc.).
   * Passes back the entire updated Task object.
   */
  onUpdateTask: (updatedTask: Task) => void;

  /**
   * Called when the user toggles completion.
   * Passes back the task’s ID.
   */
  onToggleComplete: (taskId: string) => void;

  /**
   * Called when user sets or changes the task’s scheduling priority.
   */
  onSetPriority: (taskId: string, priority: number) => void;
}

export default function TaskRowInternal({
  task,
  onUpdateTask,
  onToggleComplete,
  onSetPriority,
}: TaskRowInternalProps) {
  const [editingField, setEditingField] = useState<keyof Task | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  // Begin editing a specific field
  const handleEditInit = (field: keyof Task, value: string) => {
    setEditingField(field);
    setEditValue(value);
  };

  // Save updates to a field
  const handleSaveField = (field: keyof Task) => {
    const updatedTask: Task = { ...task, [field]: editValue };
    onUpdateTask(updatedTask);
    setEditingField(null);
  };

  // Render inline editable cell
  const renderEditableCell = (
    field: keyof Task,
    type: "text" | "date" = "text"
  ) => {
    const value = (task[field] as string) || "";
    const isEditing = editingField === field;

    if (true) {
      // If editing a date-type field, display a date picker popover
      if (type === "date") {
        const dateVal = value ? new Date(value) : new Date();

        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="mr-2">
                {format(dateVal, "PP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateVal}
                onSelect={(newDate) => {
                  if (newDate) {
                    const isoString = newDate.toISOString();
                    setEditValue(isoString);
                    handleSaveField(field);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );
      } else {
        // Editing a text field
        return (
          <Input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={() => handleSaveField(field)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSaveField(field);
              }
            }}
            autoFocus
          />
        );
      }
    }

    // If not editing, display the current value
    return (
      <div
        onClick={() => handleEditInit(field, value)}
        className="cursor-pointer"
      >
        {type === "date" && value
          ? format(new Date(value), "PP")
          : value || "-"}
      </div>
    );
  };

  // Priority assignment example. Adjust as needed (e.g. 1=High, 2=Medium, 3=Low).
  const handlePriorityClick = () => {
    // Cycle or pick a priority. Here’s a trivial example:
    const newPriority = task.priority === 1 ? 2 : task.priority === 2 ? 3 : 1;
    onSetPriority(task.id, newPriority);
  };

  return (
      <UiTableRow className="hover:bg-[#f9f9f9]">
        {/* 1. Completion Checkbox */}
        <TableCell>
          <Checkbox
            checked={task.isComplete}
            onCheckedChange={() => onToggleComplete(task.id)}
          />
        </TableCell>

        {/* 2. Task Name (inline editable) */}
        <TableCell>{renderEditableCell("name", "text")}</TableCell>

        {/* 3. Time Required (inline editable) */}
        <TableCell>{renderEditableCell("timeRequired", "text")}</TableCell>

        {/* 4. Due Date (inline editable date) */}
        <TableCell>
          <span
            className={
              task.dueDate && isPast(new Date(task.dueDate)) && !task.isComplete
                ? "text-red-500"
                : ""
            }
          >
            {renderEditableCell("dueDate", "date")}
          </span>
        </TableCell>

        {/* 5. Reminder Time (inline text for now) */}
        <TableCell>
          {renderEditableCell("reminderTime", "text")}
        </TableCell>

        {/* 6. Repeat Rule (inline text for now) */}
        <TableCell>
          {renderEditableCell("repeatRule", "text")}
        </TableCell>

      </UiTableRow>
  );
}
