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
      id: "1",
      name: "Finish Project Report",
      duration: 120,
      dueDate: "2025-02-15",
      repeatRule: RepeatOption.None,
      isComplete: false,
    },
    {
      id: "2",
      name: "Grocery Shopping",
      duration: 60,
      dueDate: "2025-02-16",
      reminderTime: "2025-02-15T19:00",
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

    // 2. Here we simulate generating scheduled blocks for the prioritized tasks.
    const newScheduledBlocks: ScheduledBlock[] = prioritizedTasks.map(
      (task) => ({
        taskId: task.id,
        priority: task.priority ?? 1,
        // Example startTime/endTime: assign them all in a row for demonstration.
        startTime: "2025-02-10T09:00",
        endTime: "2025-02-10T10:00",
      })
    );
    // 3. In a real implementation you might:
    // await fetch("/api/generate-schedule", { method: "POST", body: JSON.stringify(prioritizedTasks) })
    setScheduledBlocks(newScheduledBlocks);
  };

  // Layout: We'll place the Task List on the left and the Schedule view on the right.

  return (
    <main className="p-4 h-screen">
      <div className="flex gap-8">
        {/* Left Column: Task List */}
        <div className="w-2/3">
          <TaskListTable
            tasks={tasks}
            onUpdateTask={handleUpdateTask}
            onToggleComplete={handleToggleComplete}
            onSetPriority={handleSetPriority}
          />
          <div className="m-8 flex justify-center">
            <GenerateScheduleButton
              tasks={tasks}
              onGenerateSchedule={handleGenerateSchedule}
            />
          </div>
          {/* Registration Panel: add new tasks with AI parse */}
          <div className="m-6">
            <TaskRegistrationPanel onAddTask={handleAddTask} />
          </div>
        </div>

        {/* Right Column: Daily Schedule View */}
        <div className="w-1/3 h-[calc(100dvh-6rem)]">
          <DailyScheduleView scheduledBlocks={scheduledBlocks} tasks={tasks} />
        </div>
      </div>
    </main>
  );
}
