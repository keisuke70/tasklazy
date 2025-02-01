// fields/TaskDateField.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { parse, format } from "date-fns";

interface TaskDateFieldProps {
  value?: string;
  onChange: (value: string) => void;
}

export default function TaskDateField({ value, onChange }: TaskDateFieldProps) {
  const dateVal = value ? parse(value, "yyyy-MM-dd", new Date()) : undefined;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-[60px] ${!value && "text-muted-foreground"}`}
        >
          {dateVal ? format(dateVal, "MMM dd") : "-Date-"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={dateVal}
          onSelect={(newDate) => {
            if (newDate) {
              onChange(format(newDate, "yyyy-MM-dd"));
            }
          }}
          onClear={() => onChange("")}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
