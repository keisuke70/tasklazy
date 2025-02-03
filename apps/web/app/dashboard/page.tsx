"use client";

import React, { useState } from "react";
import TaskRegistrationPanel from "@/components/TaskRegistrationPanel";
import TaskListTable from "@/components/TaskListTable";
import GenerateScheduleButton from "@/components/GenerateScheduleButton";
import DailyScheduleView from "@/components/DailyScheduleView";
import { Task, ScheduledBlock, RepeatOption } from "@/lib/definition";

export default function HomePage() {
  // State for tasks (in a real app, you may fetch this from an API)
    const [tasks, setTasks] = useState<Task[]>([
      {
        id: "task1",
        name: "Finish Project Report",
        duration: 45, // 08:00 - 08:45
        dueDate: "2025-02-15",
        repeatRule: RepeatOption.None,
        isComplete: false,
      },
      {
        id: "task2",
        name: "Grocery Shopping",
        duration: 30, // 08:45 - 09:15
        dueDate: "2025-02-16",
        repeatRule: RepeatOption.None,
        isComplete: false,
      },
      {
        id: "task3",
        name: "Call Client",
        duration: 45, // 09:15 - 10:00
        dueDate: "2025-02-16",
        repeatRule: RepeatOption.None,
        isComplete: false,
      },
      {
        id: "task4",
        name: "Team Meeting",
        duration: 90, // 10:00 - 11:30
        dueDate: "2025-02-17",
        repeatRule: RepeatOption.None,
        isComplete: false,
      },
      {
        id: "task5",
        name: "Quick Email Check",
        duration: 30, // 11:30 - 12:00
        dueDate: "2025-02-15",
        repeatRule: RepeatOption.None,
        isComplete: false,
      },
    ]);

  // State for scheduled blocks (could also come from an API)
  const [scheduledBlocks, setScheduledBlocks] = useState<ScheduledBlock[]>([]);

  // Handler: when a user successfully parses+confirms a new task
  const handleAddTask = (newTask: Task) => {
    setTasks((prev) => [...prev, newTask]);
  };

  // Handler: when task fields are updated (due date, repeat, etc.)
  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
  };

  // Handler: toggle task completion
  const handleToggleComplete = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, isComplete: !t.isComplete } : t
      )
    );
  };

  const handleSetPriority = (taskId: string, newPriority?: number) => {
    setTasks((prevTasks) => {
      const targetTask = prevTasks.find((t) => t.id === taskId);
      if (!targetTask) return prevTasks;

      if (newPriority === undefined) {
        // Deselect: remove priority and adjust ordering.
        const oldPriority = targetTask.priority;
        if (oldPriority === undefined) return prevTasks;
        return prevTasks.map((t) => {
          if (t.id === taskId) {
            return { ...t, priority: undefined };
          }
          if (t.priority !== undefined && t.priority > oldPriority) {
            // Decrement priority for tasks that were selected later.
            return { ...t, priority: t.priority - 1 };
          }
          return t;
        });
      } else {
        // Select: assign a new priority based on the count of already selected tasks.
        const selectedCount = prevTasks.filter(
          (t) => t.priority !== undefined
        ).length;
        const assignedPriority = selectedCount + 1;
        return prevTasks.map((t) =>
          t.id === taskId ? { ...t, priority: assignedPriority } : t
        );
      }
    });
  };

  // Handler: Generate Schedule
  // (In a real app, you'd call /api/generate-schedule, then update state with the response)
  const handleGenerateSchedule = async () => {
    // 1. Filter tasks that have priority assigned (i.e. not undefined).
    const prioritizedTasks = tasks.filter(
      (task) => task.priority !== undefined
    );

    // // 2. Here we simulate generating scheduled blocks for the prioritized tasks.
    // const newScheduledBlocks: ScheduledBlock[] = prioritizedTasks.map(
    //   (task) => ({
    //     taskId: task.id,
    //     priority: task.priority!,
    //     // Example startTime/endTime: assign them all in a row for demonstration.
    //     startTime: "09:45",
    //     endTime: "10:00",
    //   })
    // );
    // Hard-coded scheduled blocks for demonstration:
    const newScheduledBlocks: ScheduledBlock[] = [
      {
        taskId: "task1",
        priority: 1,
        startTime: "08:00",
        endTime: "08:45", // Task spans 45 minutes.
      },
      {
        taskId: "task2",
        priority: 2,
        startTime: "08:45",
        endTime: "09:15", // Starts exactly when task1 ends.
      },
      {
        taskId: "task3",
        priority: 3,
        startTime: "09:15",
        endTime: "10:00", // Spans almost an hour.
      },
      {
        taskId: "task4",
        priority: 4,
        startTime: "10:00",
        endTime: "11:30", // Spans multiple hours.
      },
      {
        taskId: "task5",
        priority: 5,
        startTime: "11:30",
        endTime: "12:00", // Ends at the half-hour.
      },
    ];

    // 3. In a real implementation you might:
    // await fetch("/api/generate-schedule", { method: "POST", body: JSON.stringify(prioritizedTasks) })
    setScheduledBlocks(newScheduledBlocks);
  };

  // Layout: We'll place the Task List on the left and the Schedule view on the right.

  return (
    <div className="flex pt-10 gap-8 h-full">
      <div className="flex-[3_3_0%]">
        <div className="m-6">
          <TaskRegistrationPanel onAddTask={handleAddTask} />
        </div>
        <div className="h-1/2">
          <TaskListTable
            tasks={tasks}
            onUpdateTask={handleUpdateTask}
            onToggleComplete={handleToggleComplete}
            onSetPriority={handleSetPriority}
          />
        </div>
        <div className="m-8 flex justify-center">
          <GenerateScheduleButton
            tasks={tasks}
            onGenerateSchedule={handleGenerateSchedule}
          />
        </div>
      </div>

      {/* Right Column: Daily Schedule View – flex-grow factor of 1 */}
      <div className="flex-[1_1_0%]">
        <DailyScheduleView scheduledBlocks={scheduledBlocks} tasks={tasks} />
      </div>
    </div>
  );
}
