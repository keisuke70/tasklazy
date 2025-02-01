// fields/TaskRepeatField.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RepeatOption } from "@/lib/definition";
import { cn } from "@/lib/utils";

interface TaskRepeatFieldProps {
  value: RepeatOption;
  onChange: (value: RepeatOption) => void;
}

export default function TaskRepeatField({
  value,
  onChange,
}: TaskRepeatFieldProps) {
  const [open, setOpen] = useState(false);
  const repeatOptions = [
    RepeatOption.None,
    RepeatOption.Daily,
    RepeatOption.Weekly,
    RepeatOption.Monthly,
  ];
  const currentValue = value || RepeatOption.None;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-[80px] justify-center", {
            "text-muted-foreground": currentValue === RepeatOption.None,
          })}
        >
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
                onChange(option);
                setOpen(false);
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
