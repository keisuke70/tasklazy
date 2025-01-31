"use client";

import React, { useState } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";

interface ScheduleBlockProps {
  /** Unique ID for this block’s task (used in drag-and-drop) */
  taskId: string;

  /** Displayed task name/title */
  taskName: string;

  /** Numeric priority (1 = high, 2 = medium, 3+ = low, for example) */
  priority: number;

  /** Start time in "HH:mm" format */
  startTime: string;

  /** End time in "HH:mm" format */
  endTime: string;

  /** If true, this block cannot be dragged (for fixed events). Default: false */
  isFixed?: boolean;

  /**
   * Called when the user starts dragging this block, passing the taskId
   */
  onBlockMoveStart?: (taskId: string) => void;

  /**
   * Called when the user drops the block
   * (Typically handled in the parent onDrop, but provided if needed.)
   */
  onBlockMoveEnd?: (taskId: string, newStartTime: string) => void;
}

/** Map numeric priority to a background color or style */
function getPriorityColor(priority: number): string {
  switch (priority) {
    case 1:
      return "bg-red-200"; // High
    case 2:
      return "bg-yellow-200"; // Medium
    default:
      return "bg-blue-200"; // Low or anything else
  }
}

const ScheduleBlock: React.FC<ScheduleBlockProps> = ({
  taskId,
  taskName,
  priority,
  startTime,
  endTime,
  isFixed = false,
  onBlockMoveStart,
  onBlockMoveEnd,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    if (isFixed) {
      // Prevent dragging if this block is marked as fixed
      e.preventDefault();
      return;
    }
    setIsDragging(true);

    // Store the task ID so the parent (DailyScheduleView) can read it on drop
    e.dataTransfer.setData("text/plain", taskId);

    // Notify parent that we're dragging this block
    onBlockMoveStart?.(taskId);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if (isFixed) return;
    setIsDragging(false);

    // If you needed to handle finalizing the drop here,
    // you'd call onBlockMoveEnd with (taskId, newTimeSlot).
    // Typically, though, we handle the drop in DailyScheduleView.
  };

  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <div
            draggable={!isFixed}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            className={`
              ${getPriorityColor(priority)}
              ${isFixed ? "opacity-50 cursor-not-allowed" : "cursor-move"}
              ${isDragging ? "opacity-75" : ""}
              p-2 rounded-md shadow-md
              transition-all duration-200 ease-in-out
            `}
          >
            <h3 className="font-semibold truncate">{taskName}</h3>
            <p className="text-xs">
              {startTime} - {endTime}
            </p>
          </div>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="bg-white p-2 rounded shadow-lg z-50"
            sideOffset={5}
          >
            <p className="font-bold">{taskName}</p>
            <p>Priority: {priority}</p>
            <p>
              {startTime} - {endTime}
            </p>
            <Tooltip.Arrow className="fill-white" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export default ScheduleBlock;
