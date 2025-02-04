"use client";

import React, { useState, useEffect } from "react";
import { Task, ScheduledBlock } from "@/lib/definition";
import ScheduleBlock from "./ScheduleBlock";

interface FixedEvent {
  id: string;
  name: string;
  startTime: string; // e.g., "09:15"
  endTime: string; // e.g., "10:00"
}

interface DailyScheduleViewProps {
  tasks: Task[];
  scheduledBlocks: ScheduledBlock[];
  fixedEvents?: FixedEvent[];
  onTaskMove?: (taskId: string, newStartTime: string) => void;
}

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

/** 06:00 => 360 minutes from midnight, 22:00 => 1320 minutes */
const START_OF_DAY = 6 * 60; // 360
const END_OF_DAY = 22 * 60; // 1320
/** Total minutes from 06:00 to 22:00 is 960, so 960 px tall if 1 minute = 1px. */
const TOTAL_DAY_HEIGHT_PX = END_OF_DAY - START_OF_DAY;

/** Convert "HH:mm" => (hour, minute) */
function parseTime(timeStr: string) {
  const [h, m] = timeStr.split(":").map(Number);
  return { hour: h || 0, minute: m || 0 };
}

/** Add minutes to a "HH:mm" string */
function addMinutes(timeStr: string, minutesToAdd: number): string {
  const { hour, minute } = parseTime(timeStr);
  let total = hour * 60 + minute + minutesToAdd;
  // clamp between 00:00 and 23:59
  total = Math.max(0, Math.min(total, 24 * 60 - 1));
  const newH = String(Math.floor(total / 60)).padStart(2, "0");
  const newM = String(total % 60).padStart(2, "0");
  return `${newH}:${newM}`;
}

/** Return how many pixels from the top (06:00) a given "HH:mm" is. */
function computeTopOffsetPx(timeStr: string): number {
  const { hour, minute } = parseTime(timeStr);
  const totalFromMidnight = hour * 60 + minute;
  const offsetFromStart = totalFromMidnight - START_OF_DAY; // e.g., 8:15 => (8*60+15)-360=135
  // clamp so we never go below 0 or above container
  return Math.max(0, Math.min(TOTAL_DAY_HEIGHT_PX, offsetFromStart));
}

/** For an entire day from 06:00 -> 22:00, each hour label is 60px tall (1px = 1 minute). */
const HOUR_LABEL_HEIGHT_PX = 60;

/** Info about a block being dragged. */
interface DraggingState {
  taskId: string;
  originalStartTime: string;
  originalClientY: number;
  newStartTime: string;
}

export default function DailyScheduleView({
  tasks,
  scheduledBlocks,
  fixedEvents = [],
  onTaskMove,
}: DailyScheduleViewProps) {
  const [dragging, setDragging] = useState<DraggingState | null>(null);

  // Helpers
  const getTaskById = (id: string) => tasks.find((t) => t.id === id);
  const getTaskName = (id: string) => getTaskById(id)?.name ?? "";
  const getTaskDuration = (id: string) => getTaskById(id)?.duration ?? 0;

  /** Start drag on mousedown */
  const handleBlockMouseDown = (e: React.MouseEvent, block: ScheduledBlock) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging({
      taskId: block.taskId,
      originalStartTime: block.startTime,
      originalClientY: e.clientY,
      newStartTime: block.startTime,
    });
  };

  /** Listen for mousemove/mouseup globally while dragging. */
  useEffect(() => {
    if (!dragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = e.clientY - dragging.originalClientY;
      // 1px => 1 minute
      const increments = Math.round(deltaY);
      const computedNewStart = addMinutes(
        dragging.originalStartTime,
        increments
      );
      if (computedNewStart !== dragging.newStartTime) {
        setDragging((prev) =>
          prev ? { ...prev, newStartTime: computedNewStart } : null
        );
      }
    };

    const handleMouseUp = () => {
      if (dragging && onTaskMove) {
        onTaskMove(dragging.taskId, dragging.newStartTime);
      }
      setDragging(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, onTaskMove]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg h-full overflow-x-hidden border-2 border-gray-300">
      <h2 className="text-xl font-semibold mb-4">Today’s Schedule</h2>
      {/* Two-column layout: left for hour labels, right for a single container with lines & tasks */}
      <div className="grid grid-cols-[auto_1fr] ">
        {/* LEFT COLUMN: Hour labels stacked vertically */}
        <div>
          {displayTimeSlots.map((timeSlot) => (
            <div
              key={timeSlot}
              className="text-sm text-gray-600 w-16"
              style={{ height: HOUR_LABEL_HEIGHT_PX }}
            >
              {timeSlot}
            </div>
          ))}
        </div>

        {/* RIGHT COLUMN: Single large container with hour lines + tasks + events */}
        <div
          className="relative border-t border-gray-200 top-2"
          style={{
            height: (displayTimeSlots.length - 1) * HOUR_LABEL_HEIGHT_PX, // e.g. 16*60=960
          }}
        >
          {/* 1) Render hour lines behind tasks (zIndex: 0) */}
          <div className="absolute inset-0 pointer-events-none">
            {displayTimeSlots.map((_, i) => {
              const topPx = i * HOUR_LABEL_HEIGHT_PX;
              return (
                <div
                  key={i}
                  className="absolute w-full border-t border-gray-200"
                  style={{
                    top: topPx,
                    zIndex: 0,
                  }}
                />
              );
            })}
          </div>

          {/* 2) Non-dragging scheduled blocks (zIndex: 1) */}
          {scheduledBlocks.map((block) => {
            if (dragging && block.taskId === dragging.taskId) return null;

            const topOffsetPx = computeTopOffsetPx(block.startTime);
            const heightPx = getTaskDuration(block.taskId);
            return (
              <div
                key={`${block.taskId}-${block.startTime}`}
                style={{
                  position: "absolute",
                  top: topOffsetPx,
                  height: heightPx,
                  width: "100%",
                  zIndex: 1,
                }}
              >
                <ScheduleBlock
                  taskId={block.taskId}
                  taskName={getTaskName(block.taskId)}
                  priority={block.priority}
                  startTime={block.startTime}
                  duration={heightPx}
                  onBlockMoveStart={(e) => handleBlockMouseDown(e, block)}
                  style={{
                    position: "absolute",
                    height: heightPx,
                    width: "100%",
                  }}
                />
              </div>
            );
          })}

          {/* 3) Fixed events (zIndex: 1 as well) */}
          {fixedEvents.map((ev) => {
            // simple calculation: endTime-minutes - startTime-minutes
            const { hour: startH, minute: startM } = parseTime(ev.startTime);
            const { hour: endH, minute: endM } = parseTime(ev.endTime);
            const durationMinutes = endH * 60 + endM - (startH * 60 + startM);

            const topOffsetPx = computeTopOffsetPx(ev.startTime);
            const eventHeightPx = durationMinutes;

            return (
              <div
                key={ev.id}
                style={{
                  position: "absolute",
                  top: topOffsetPx,
                  height: eventHeightPx,
                  width: "100%",
                  zIndex: 1,
                }}
                className="bg-gray-300 text-sm p-1 rounded flex items-center justify-center"
              >
                <span className="text-gray-800 font-medium">{ev.name}</span>
              </div>
            );
          })}

          {/* 4) If dragging, render ghost + dragged copy (zIndex: 2) */}
          {dragging && (
            <>
              {/* Ghost at original */}
              <div
                style={{
                  position: "absolute",
                  top: computeTopOffsetPx(dragging.originalStartTime),
                  height: getTaskDuration(dragging.taskId),
                  width: "100%",
                  opacity: 0.5,
                  pointerEvents: "none",
                  zIndex: 2,
                }}
              >
                <ScheduleBlock
                  taskId={dragging.taskId}
                  taskName={getTaskName(dragging.taskId)}
                  priority={
                    scheduledBlocks.find((b) => b.taskId === dragging.taskId)
                      ?.priority ?? 1
                  }
                  startTime={dragging.originalStartTime}
                  duration={getTaskDuration(dragging.taskId)}
                  style={{
                    position: "absolute",
                    height: getTaskDuration(dragging.taskId),
                    width: "100%",
                    border: "1px dashed gray",
                  }}
                />
              </div>

              {/* Moved copy */}
              {dragging.newStartTime !== dragging.originalStartTime && (
                <div
                  style={{
                    position: "absolute",
                    top: computeTopOffsetPx(dragging.newStartTime),
                    height: getTaskDuration(dragging.taskId),
                    width: "100%",
                    zIndex: 2,
                  }}
                >
                  <ScheduleBlock
                    taskId={dragging.taskId}
                    taskName={getTaskName(dragging.taskId)}
                    priority={
                      scheduledBlocks.find((b) => b.taskId === dragging.taskId)
                        ?.priority ?? 1
                    }
                    startTime={dragging.newStartTime}
                    duration={getTaskDuration(dragging.taskId)}
                    style={{
                      position: "absolute",
                      height: getTaskDuration(dragging.taskId),
                      width: "100%",
                    }}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
