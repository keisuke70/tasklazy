// fields/TaskTimeField.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface TaskTimeFieldProps {
  value?: number;
  onChange: (value: number) => void;
}

const timeOptions = [
  { value: 5, label: "5m" },
  { value: 10, label: "10m" },
  { value: 15, label: "15m" },
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

export default function TaskTimeField({ value, onChange }: TaskTimeFieldProps) {
  const [open, setOpen] = useState(false);
  const currentMinutes = typeof value === "number" ? value : 0;
  const formattedTime =
    timeOptions.find((opt) => opt.value === currentMinutes)?.label || "-time-";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[90px] justify-center">
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
                onChange(option.value);
                setOpen(false);
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
