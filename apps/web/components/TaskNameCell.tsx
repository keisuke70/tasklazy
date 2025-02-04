"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface TaskNameCellProps {
  value: string;
  editDetails: boolean;
  onChange?: (newValue: string) => void;
  priority?: number;
}

export default function TaskNameCell({
  value,
  editDetails,
  onChange,
  priority,
}: TaskNameCellProps) {
  return (
    <div className="relative">
      {editDetails ? (
        // Edit mode: show an input field.
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          className="w-full p-2 font-medium"
        />
      ) : (
        <div className="select-none cursor-default touch-none">
          <div className="font-medium pb-1">{value}</div>
        </div>
      )}
    </div>
  );
}
