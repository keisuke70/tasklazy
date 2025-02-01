// fields/TaskDateTimeField.tsx
"use client";

import React from "react";
import { DateTimePicker24h } from "@/components/ui/DateTimePicker24h";

interface TaskDateTimeFieldProps {
  value?: string;
  onChange: (value: string) => void;
}

export default function TaskDateTimeField({
  value,
  onChange,
}: TaskDateTimeFieldProps) {
  return (
    <DateTimePicker24h
      value={value ? new Date(value) : undefined}
      onChange={(newDate) => onChange(newDate?.toISOString() || "")}
    />
  );
}
