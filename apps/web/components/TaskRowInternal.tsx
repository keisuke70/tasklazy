"use client";

import React, { useState, useEffect } from "react";
import { format, isPast } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow as UiTableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { DateTimePicker24h } from "@/components/ui/DateTimePicker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Task, RepeatOption } from "@/lib/definition";

export interface TaskRowInternalProps {
  task: Task;
  editDetails: boolean;
  onUpdateTask: (updatedTask: Task) => void;
  onToggleComplete: (taskId: string) => void;
}

export default function TaskRowInternal({
  task,
  editDetails,
  onUpdateTask,
  onToggleComplete,
}: TaskRowInternalProps) {
  const [tempTask, setTempTask] = useState<Task>(task);
  const [timePopoverOpen, setTimePopoverOpen] = useState(false);
  const [repeatPopoverOpen, setRepeatPopoverOpen] = useState(false);
  
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

  const renderField = (
    field: keyof Task,
    type: "text" | "time" | "date" | "date_time" | "repeat" = "text"
  ) => {
    const value = tempTask[field];

    if (!editDetails) {
      if (type === "date" && typeof value === "string") {
        return format(new Date(value), "PP");
      }
      if (type === "time" && typeof value === "number") {
        const hours = Math.floor(value / 60);
        const minutes = value % 60;
        return (
          [hours > 0 ? `${hours}h` : "", minutes > 0 ? `${minutes}m` : ""]
            .filter(Boolean)
            .join(" ") || "0m"
        );
      }
      return value?.toString() || "-";
    }

    if (type === "time") {
      const timeOptions = [
        { value: 5, label: "5m" },
        { value: 10, label: "10m" },
        { value: 15, label: "15m" },
        { value: 20, label: "20m" },
        { value: 25, label: "25m" },
        { value: 30, label: "30m" },
        { value: 45, label: "45m" },
        { value: 60, label: "1h" },
        { value: 90, label: "1h 30m" },
        { value: 120, label: "2h" },
        { value: 150, label: "2h 30m" },
        { value: 180, label: "3h" },
        { value: 210, label: "3h 30m" },
        { value: 240, label: "4h" },
        { value: 270, label: "4h 30m" },
        { value: 300, label: "5h" },
      ];

      const currentMinutes = typeof value === "number" ? value : 0;
      const formattedTime =
        timeOptions.find((opt) => opt.value === currentMinutes)?.label ||
        "Select time";

      return (
        <Popover open={timePopoverOpen} onOpenChange={setTimePopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[120px] justify-start">
              {formattedTime}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2 max-h-[300px] overflow-y-auto">
            <div className="grid grid-cols-1 gap-1">
              {timeOptions.map((option) => (
                <Button
                  key={option.value}
                  variant="ghost"
                  className="justify-start"
                  onClick={() => {
                    handleFieldChange("duration", option.value);
                    setTimePopoverOpen(false);
                  }}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      );
    }

    if (type === "date") {
      const dateVal = value ? new Date(value as string) : new Date();

      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="mr-2">
              {format(dateVal, "MMM dd")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dateVal}
              onSelect={(newDate) => {
                if (newDate) {
                  handleFieldChange(
                    "dueDate",
                    newDate.toISOString().split("T")[0]
                  );
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      );
    }

    if (type === "date_time") {
      return (
        <DateTimePicker24h
          value={value ? new Date(value as string) : undefined}
          onChange={(newDate) => {
            handleFieldChange("reminderTime", newDate?.toISOString() || "");
          }}
        />
      );
    }
    if (type === "repeat") {
      const repeatOptions = [
        RepeatOption.None,
        RepeatOption.Daily,
        RepeatOption.Weekly,
        RepeatOption.Monthly,
      ];

      const currentValue = (value as RepeatOption) || RepeatOption.None;

      if (!editDetails) {
        return currentValue === RepeatOption.None ? "-" : currentValue;
      }

      return (
        <Popover open={repeatPopoverOpen} onOpenChange={setRepeatPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[120px] justify-start">
              {currentValue}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2 max-h-[300px] overflow-y-auto">
            <div className="grid grid-cols-1 gap-1">
              {repeatOptions.map((option) => (
                <Button
                  key={option}
                  variant="ghost"
                  className="justify-start"
                  onClick={() => {
                    handleFieldChange("repeatRule", option);
                    setRepeatPopoverOpen(false);
                  }}
                >
                  {option}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      );
    }

    return (
      <Input
        type="text"
        value={value?.toString() || ""}
        onChange={(e) => handleFieldChange(field, e.target.value)}
      />
    );
  };

  return (
    <UiTableRow className="hover:bg-[#f9f9f9]">
      <TableCell>
        <Checkbox
          checked={task.isComplete}
          onCheckedChange={() => onToggleComplete(task.id)}
        />
      </TableCell>

      <TableCell>{renderField("name")}</TableCell>

      {editDetails && (
        <>
          <TableCell>{renderField("duration", "time")}</TableCell>
          <TableCell
            className={
              task.dueDate && isPast(new Date(task.dueDate)) && !task.isComplete
                ? "text-red-500"
                : ""
            }
          >
            {renderField("dueDate", "date")}
          </TableCell>
          <TableCell>{renderField("reminderTime", "date_time")}</TableCell>
          <TableCell>{renderField("repeatRule", "repeat")}</TableCell>
        </>
      )}

      <TableCell />
    </UiTableRow>
  );
}
