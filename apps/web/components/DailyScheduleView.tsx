"use client";

import React, { useState } from "react";
import { Task, ScheduledBlock } from "@/lib/definition";
import ScheduleBlock from "./ScheduleBlock";

interface FixedEvent {
  id: string;
  name: string;
  startTime: string; // e.g., "09:15" in "HH:mm" format
  endTime: string; // e.g., "10:00"
}

interface DailyScheduleViewProps {
  tasks: Task[];
  scheduledBlocks: ScheduledBlock[];
  fixedEvents?: FixedEvent[];
  onTaskMove?: (taskId: string, newStartTime: string) => void;
}

// Each hour cell is labeled but has 56px in height for the 60 minutes.
const displayTimeSlots = [
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

/** Convert "HH:mm" to {hour, minute}. */
function parseTime(timeStr: string) {
  const [hourStr, minuteStr] = timeStr.split(":").map((x) => x.trim());
  return {
    hour: Number(hourStr),
    minute: Number(minuteStr),
  };
}

/** The height for each hour cell in pixels. */
const CELL_HEIGHT_PX = 60;

export default function DailyScheduleView({
  tasks,
  scheduledBlocks,
  fixedEvents = [],
  onTaskMove,
}: DailyScheduleViewProps) {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  // Allows drop on hour cell.
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // When dropping onto an hour cell, you could snap to that hour or do a finer calculation.
  const handleDrop = (e: React.DragEvent, cellHour: string) => {
    e.preventDefault();
    const droppedTaskId = e.dataTransfer.getData("text/plain");
    if (!droppedTaskId || !onTaskMove) return;

    // Example: Snap to the top of that hour cell if you want (06:00, 07:00, etc.)
    // Or you could look at the mouse position to decide the nearest 15-min mark.
    onTaskMove(droppedTaskId, cellHour);
    setDraggedTaskId(null);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg h-full overflow-x-hidden border-2 border-gray-300">
      <h2 className="text-xl font-semibold mb-4">Today’s Schedule</h2>
      <div className="grid grid-cols-[auto_1fr] gap-2">
        {displayTimeSlots.map((timeSlot) => {
          const { hour: cellHour } = parseTime(timeSlot);

          // Filter blocks whose startTime is in this hour.
          const blocksInCell = scheduledBlocks.filter((block) => {
            const { hour } = parseTime(block.startTime);

            return hour === cellHour;
          });

          // Filter fixed events that start in this hour (if you still need them).
          const fixedInCell = fixedEvents.filter((ev) => {
            const { hour } = parseTime(ev.startTime);
            return hour === cellHour;
          });

          return (
            <React.Fragment key={timeSlot}>
              {/* Left-side label for the hour */}
              <div className="text-right pr-2 py-2 text-sm text-gray-600 w-16">
                {timeSlot}
              </div>

              {/* The hour cell. We place tasks absolutely within it. */}
              <div
                className="border-t border-gray-200 relative top-4"
                style={{ height: CELL_HEIGHT_PX }}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, timeSlot)}
              >
                {blocksInCell.map((block) => {
                  // Find this task's duration so we can compute height.
                  const foundTask = tasks.find((t) => t.id === block.taskId);
                  if (!foundTask) return null;

                  const { minute: startMinute } = parseTime(block.startTime);

                  // Convert the start minute into a top offset in px.
                  const topOffsetPx = (startMinute / 60) * CELL_HEIGHT_PX;
                  // Convert duration into a block height in px.
                  const blockHeightPx =
                    (foundTask.duration / 60) * CELL_HEIGHT_PX + 5;

                  return (
                    <div
                      key={`${block.taskId}-${block.startTime}`}
                      style={{
                        position: "absolute",
                        top: topOffsetPx,
                        height: blockHeightPx,
                        width: "100%",
                      }}
                    >
                      <ScheduleBlock
                        taskId={block.taskId}
                        taskName={foundTask.name}
                        priority={block.priority}
                        startTime={block.startTime}
                        duration={foundTask.duration}
                        onBlockMoveStart={(id) => setDraggedTaskId(id)}
                        style={{
                          position: "absolute",
                          height: blockHeightPx,
                          width: "100%",
                        }}
                      />
                    </div>
                  );
                })}

                {fixedInCell.map((ev) => {
                  // Example: if each fixed event is always 15 minutes:
                  const { minute: evStartMin } = parseTime(ev.startTime);
                  const topOffsetPx = (evStartMin / 60) * CELL_HEIGHT_PX;
                  const eventHeightPx = (15 / 60) * CELL_HEIGHT_PX;

                  return (
                    <div
                      key={ev.id}
                      style={{
                        position: "absolute",
                        top: topOffsetPx,
                        height: eventHeightPx,
                        width: "100%",
                      }}
                      className="bg-gray-300 text-sm p-1 rounded flex items-center justify-center"
                    >
                      <span className="text-gray-800 font-medium">
                        {ev.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
