"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  onClear?: () => void;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  onClear,
  ...props
}: CalendarProps) {
  return (
    <div className="flex flex-col gap-y-2">
      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn("p-3", className)}
        classNames={{
          months:
            "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4",
          caption: "flex justify-center pt-1 relative items-center",
          caption_label: "text-sm font-medium",
          nav: "space-x-1 flex items-center",
          nav_button: cn(
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
            "inline-flex items-center justify-center rounded-md text-sm font-medium",
            "transition-colors focus-visible:outline-none focus-visible:ring-1",
            "focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          ),
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell:
            "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
          row: "flex w-full mt-2",
          cell: cn(
            "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
            "[&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50",
            "[&:has([aria-selected].day-range-end)]:rounded-r-md",
            props.mode === "range"
              ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md"
              : "[&:has([aria-selected])]:rounded-md"
          ),
          day: cn(
            "h-8 w-8 p-0 font-normal aria-selected:opacity-100",
            "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm",
            "transition-colors focus-visible:outline-none focus-visible:ring-1",
            "focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
            "hover:bg-accent hover:text-accent-foreground"
          ),
          day_selected:
            "bg-primary text-primary-foreground hover:bg-primary/90",
          day_today: "bg-accent text-accent-foreground",
          day_outside: "day-outside text-muted-foreground opacity-50",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle:
            "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
          ...classNames,
        }}
        components={{
          IconLeft: ({ className, ...props }) => (
            <ChevronLeft className={cn("h-4 w-4", className)} {...props} />
          ),
          IconRight: ({ className, ...props }) => (
            <ChevronRight className={cn("h-4 w-4", className)} {...props} />
          ),
        }}
        {...props}
      />
      {onClear && (
        <div className="border-t p-2 text-right">
          <Button
            variant="outline"
            size="sm"
            onClick={onClear}
            className="h-8 px-3 text-xs"
          >
            Clear
          </Button>
        </div>
      )}
    </div>
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
