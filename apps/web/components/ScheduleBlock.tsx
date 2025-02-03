"use client";

import React, { useState } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";

interface ScheduleBlockProps {
  taskId: string;
  taskName: string;
  priority: number;
  startTime: string;
  duration: number;
  isFixed?: boolean;
  onBlockMoveStart?: (taskId: string) => void;

  /**
   * Called when the user drops the block.
   * Typically handled in the parent onDrop, but provided if needed.
   */
  onBlockMoveEnd?: (taskId: string, newStartTime: string) => void;

  /** Optional style to apply directly to the outer container of this ScheduleBlock */
  style?: React.CSSProperties;
}

/** Convert "HH:mm" => total minutes since midnight. */
function parseTimeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(":").map(Number);
  return h! * 60 + m!;
}

/** Convert total minutes since midnight => "HH:mm". */
function minutesToTimeStr(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const hh = hours.toString().padStart(2, "0");
  const mm = minutes.toString().padStart(2, "0");
  return `${hh}:${mm}`;
}

/** Map numeric priority to a background color or style */
function getPriorityColor(priority: number): string {
  switch (priority) {
    case 1:
      return "bg-red-200"; // High
    case 2:
      return "bg-yellow-200"; // Medium
    default:
      return "bg-blue-200"; // Low
  }
}

const ScheduleBlock: React.FC<ScheduleBlockProps> = ({
  taskId,
  taskName,
  priority,
  startTime,
  duration,
  isFixed = false,
  onBlockMoveStart,
  onBlockMoveEnd,
  style,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  // Calculate the endTime from startTime + duration.
  const startMinutes = parseTimeToMinutes(startTime);
  const endMinutes = startMinutes + duration;
  const endTime = minutesToTimeStr(endMinutes);

  const handleDragStart = (e: React.DragEvent) => {
    if (isFixed) {
      // Prevent dragging if block is fixed
      e.preventDefault();
      return;
    }
    setIsDragging(true);

    // Store the task ID for reading in parent onDrop
    e.dataTransfer.setData("text/plain", taskId);

    onBlockMoveStart?.(taskId);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if (isFixed) return;
    setIsDragging(false);
    // If needed, onBlockMoveEnd could be called here,
    // but typically the parent handles final drop logic.
  };

  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <div
            style={style} // The outermost div is absolutely positioned if `style` is passed in
            draggable={!isFixed}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            className={`
              ${getPriorityColor(priority)}
              ${isFixed ? "opacity-50 cursor-not-allowed" : "cursor-move"}
              ${isDragging ? "opacity-75" : ""}
              p-1 rounded-md shadow-md
              transition-all duration-200 ease-in-out
            `}
          >
            {/* If duration <= 30, show times on the same line. Otherwise, separate line. */}
            {duration <= 30 ? (
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-xs truncate w-1/2">
                  {taskName}
                </h3>
                <span className="text-[10px] mr-2">
                  {startTime} - {endTime}
                </span>
              </div>
            ) : (
              <>
                <h3 className="font-medium text-xs truncate w-4/5">
                  {taskName}
                </h3>
                <p className="text-[10px]">
                  {startTime} - {endTime}
                </p>
              </>
            )}
          </div>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="bg-white p-2 rounded shadow-lg z-50"
            sideOffset={5}
          >
            <p className="font-semibold">{taskName}</p>
            <p>Priority: {priority}</p>
            <p>
              Start: {startTime} <br />
              End: {endTime} <br />
              Duration: {duration} min
            </p>
            <Tooltip.Arrow className="fill-white" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export default ScheduleBlock;
