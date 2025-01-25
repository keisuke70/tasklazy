"use client";

import { useState } from "react";
import { format, addDays, isSameDay } from "date-fns";
import { Button } from "@/components/ui/button";

export function DaySelector({
  selectedDate,
  onSelectDate,
}: {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}) {
  const [startIndex, setStartIndex] = useState(0);

  const handleScroll = (direction: "up" | "down") => {
    if (direction === "up" && startIndex >= 5) {
      setStartIndex((prevIndex) => prevIndex - 5);
    } else if (direction === "down") {
      setStartIndex((prevIndex) => prevIndex + 5);
    }
  };

  // Generate the visible dates (5 days based on the current startIndex)
  const visibleDates = Array.from({ length: 5 }, (_, i) =>
    addDays(new Date(), startIndex + i)
  );

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Select Day</h2>
      <div className="flex flex-col space-y-2 max-h-[300px] overflow-hidden">
        {visibleDates.map((date) => (
          <Button
            key={date.toISOString()}
            variant={isSameDay(date, selectedDate) ? "default" : "outline"}
            onClick={() => onSelectDate(date)}
            className="justify-start"
          >
            {format(date, "EEE, MMM d")}
          </Button>
        ))}
      </div>
      <div className="flex justify-between mt-4">
        <Button
          variant="outline"
          onClick={() => handleScroll("up")}
          disabled={startIndex === 0}
        >
          Previous
        </Button>
        <Button variant="outline" onClick={() => handleScroll("down")}>
          Next
        </Button>
      </div>
    </div>
  );
}
