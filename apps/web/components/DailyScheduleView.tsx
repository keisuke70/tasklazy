"use client";

import React, { useState } from "react";
import { Task, ScheduledBlock } from "@/lib/definition";
import ScheduleBlock from "./ScheduleBlock";

// (Optional) If you have events from Google Calendar or other sources:
interface FixedEvent {
  id: string;
  name: string;
  startTime: string; // e.g., "09:00" in "HH:mm" format
  endTime: string; // e.g., "10:00" in "HH:mm" format
}

interface DailyScheduleViewProps {
  /** All tasks in the system; used to find task names etc. */
  tasks: Task[];

  /** The scheduled blocks for the day, containing priority + time slots. */
  scheduledBlocks: ScheduledBlock[];

  /** Optional external events (fixed) that should appear on the timeline. */
  fixedEvents?: FixedEvent[];

  /**
   * Called when a user drags-and-drops a scheduled task
   * to a new time slot.
   */
  onTaskMove?: (taskId: string, newStartTime: string) => void;
}

// Example hour-only time slots. You can add half-hours if desired.
const timeSlots = [
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
];

export default function DailyScheduleView({
  tasks,
  scheduledBlocks,
  fixedEvents = [],
  onTaskMove,
}: DailyScheduleViewProps) {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  // Allow drop on time-slot divs
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // When a block is dropped onto a time slot
  const handleDrop = (e: React.DragEvent, timeSlot: string) => {
    e.preventDefault();
    const droppedTaskId = e.dataTransfer.getData("text/plain");
    if (!droppedTaskId || !onTaskMove) return;

    // If you want to prevent overlap with fixed events, check here:
    const overlap = fixedEvents.some((ev) => ev.startTime === timeSlot);
    if (overlap) {
      alert("Cannot move task: Overlaps with a fixed event");
      return;
    }

    // Notify the parent that the block was moved
    onTaskMove(droppedTaskId, timeSlot);
    setDraggedTaskId(null);
  };

  // Optionally combine your "HH:mm" with a date (like "2025-02-10T" + timeSlot)
  // if you're doing multi-day scheduling. For MVP, we keep it simple.
  const asDateTime = (timeSlot: string) => {
    return timeSlot; // or e.g. `"2025-02-10T${timeSlot}:00"`
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg h-full overflow-auto border-2 border-gray-300">
      <h2 className="text-xl font-semibold mb-4">Today’s Schedule</h2>
      <div className="grid grid-cols-[auto_1fr] gap-2">
        {timeSlots.map((timeSlot) => {
          const slotDateTime = asDateTime(timeSlot);

          // Blocks scheduled to start exactly at slotDateTime (e.g., "09:00")
          const slotBlocks = scheduledBlocks.filter(
            (b) => b.startTime === slotDateTime
          );

          // Fixed events that start at the same time
          const slotFixed = fixedEvents.filter(
            (ev) => ev.startTime === slotDateTime
          );

          return (
            <React.Fragment key={timeSlot}>
              {/* Left-side label (the hour) */}
              <div className="text-right pr-2 py-2 text-sm text-gray-600 w-16">
                {timeSlot}
              </div>

              {/* Right-side slot container */}
              <div
                className="border-t border-gray-200 relative h-14"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, slotDateTime)}
              >
                {/* Render each scheduled block that starts at this time */}
                {slotBlocks.map((block) => {
                  // Find the matching Task to display name, etc.
                  const foundTask = tasks.find((t) => t.id === block.taskId);
                  if (!foundTask) return null;

                  return (
                    <ScheduleBlock
                      key={block.taskId}
                      taskId={block.taskId}
                      taskName={foundTask.name}
                      priority={block.priority}
                      startTime={block.startTime}
                      endTime={block.endTime}
                      // Called by the block on drag start
                      onBlockMoveStart={(id) => setDraggedTaskId(id)}
                      // Called if you want to handle drop logic from the block
                      // or do nothing, if you handle it all in handleDrop
                      onBlockMoveEnd={onTaskMove}
                    />
                  );
                })}

                {/* Render any fixed events at this time */}
                {slotFixed.map((ev) => (
                  <div
                    key={ev.id}
                    className="absolute inset-y-0 left-2 right-2 bg-gray-300 text-sm p-1 rounded flex items-center justify-center"
                  >
                    <span className="text-gray-800 font-medium">{ev.name}</span>
                  </div>
                ))}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
