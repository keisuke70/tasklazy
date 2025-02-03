"use client";

import * as React from "react";
import {
  format,
  isBefore,
  startOfDay,
  isSameDay,
  getHours,
  getMinutes,
} from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface DateTimePicker24hProps {
  value?: Date;
  onChange?: (newDate: Date | undefined) => void;
}

export function DateTimePicker24h({ value, onChange }: DateTimePicker24hProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(new Date());

  // Calculate time values once when picker opens
  const currentDayStart = startOfDay(currentTime);
  const currentHour = getHours(currentTime);
  const currentMinute = getMinutes(currentTime);

  const disabledDays = (day: Date) => isBefore(day, currentDayStart);

  const isHourDisabled = (date: Date, hour: number) => {
    if (!isSameDay(date, currentDayStart)) return false;
    return hour < currentHour;
  };

  const isMinuteDisabled = (date: Date, hour: number, minute: number) => {
    if (!isSameDay(date, currentDayStart)) return false;
    if (hour < currentHour) return true;
    if (hour === currentHour) return minute < currentMinute;
    return false;
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    const newDate = new Date(selectedDate);
    if (isSameDay(newDate, currentDayStart)) {
      if (isBefore(newDate, currentTime)) {
        newDate.setHours(currentHour, currentMinute);
      }
    }

    onChange?.(newDate);
  };

  const handleTimeChange = (hours: number, minutes: number) => {
    if (!value) return;

    const newDate = new Date(value);
    newDate.setHours(hours, minutes);

    if (isSameDay(newDate, currentDayStart) && isBefore(newDate, currentTime)) {
      newDate.setHours(currentHour, currentMinute);
    }

    onChange?.(newDate);
  };

  const handleClear = () => onChange?.(undefined);
  const displayLabel = value
    ? format(value, "MMM d, HH:mm")
    : "-Date/Time-";

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-center text-left font-500 w-[120px]",
            !value && "text-muted-foreground"
          )}
        >
          {displayLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="sm:flex">
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleDateSelect}
            disabled={disabledDays}
            initialFocus
          />

          <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {Array.from({ length: 24 }, (_, i) => i).map((hour) => {
                  const isDisabled = value ? isHourDisabled(value, hour) : true;
                  const isSelected = value?.getHours() === hour;

                  return (
                    <Button
                      key={hour}
                      size="icon"
                      variant={isSelected ? "default" : "ghost"}
                      className={cn(
                        "sm:w-full shrink-0 aspect-square",
                        isDisabled &&
                          "text-muted-foreground opacity-50 cursor-not-allowed"
                      )}
                      onClick={() =>
                        handleTimeChange(hour, value?.getMinutes() || 0)
                      }
                      disabled={isDisabled}
                    >
                      {hour}
                    </Button>
                  );
                })}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>

            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => {
                  const isDisabled = value
                    ? isMinuteDisabled(value, value.getHours(), minute)
                    : true;
                  const isSelected = value?.getMinutes() === minute;

                  return (
                    <Button
                      key={minute}
                      size="icon"
                      variant={isSelected ? "default" : "ghost"}
                      className={cn(
                        "sm:w-full shrink-0 aspect-square",
                        isDisabled &&
                          "text-muted-foreground opacity-50 cursor-not-allowed"
                      )}
                      onClick={() =>
                        handleTimeChange(value?.getHours() || 0, minute)
                      }
                      disabled={isDisabled}
                    >
                      {minute.toString().padStart(2, "0")}
                    </Button>
                  );
                })}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
          </div>
        </div>

        <div className="border-t p-2 text-right">
          <Button variant="outline" onClick={handleClear}>
            Clear
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
