"use client";

import React, { useState } from "react";
import TaskRegistrationPanel from "@/components/TaskRegistrationPanel";
import TaskListTable from "@/components/TaskListTable";
import GenerateScheduleButton from "@/components/GenerateScheduleButton";
import DailyScheduleView from "@/components/DailyScheduleView";
import { Task, ScheduledBlock } from "@/lib/definition";

export default function HomePage() {
  // State for tasks (in a real app, you may fetch this from an API)
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      name: "Finish Project Report",
      timeRequired: "2h",
      dueDate: "2025-02-15",
      repeatRule: "",
      isComplete: false,
    },
    {
      id: "2",
      name: "Grocery Shopping",
      timeRequired: "1h",
      dueDate: "2025-02-16",
      reminderTime: "2025-02-15T19:00",
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

  // Handler: assign a priority to a task for scheduling
  const handleSetPriority = (taskId: string, priority: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, priority } : t))
    );
  };

  // Handler: Generate Schedule
  // (In a real app, you'd call /api/generate-schedule, then update state with the response)
  const handleGenerateSchedule = async () => {
    // 1. Filter tasks that have priority assigned (not undefined).
    const prioritizedTasks = tasks.filter(
      (task) => task.priority !== undefined
    );

    // 2. Suppose we have a mock function to place them in free slots,
    // here we'll just simulate:
    const newScheduledBlocks: ScheduledBlock[] = prioritizedTasks.map(
      (task) => ({
        taskId: task.id,
        priority: task.priority ?? 1,
        // Example startTime/endTime: assign them all in a row for demonstration
        startTime: "2025-02-10T09:00",
        endTime: "2025-02-10T10:00",
      })
    );
    // 3. In reality, you'd:
    // await fetch("/api/generate-schedule", { method: "POST", body: JSON.stringify(prioritizedTasks) })

    setScheduledBlocks(newScheduledBlocks);
  };

  // Layout: We'll place the Task List on the left, the schedule on the right
  // For brevity, we use a simple CSS flex container:
  return (
    <main className="p-4 h-screen">
      <h1 className="text-2xl font-bold mb-4">My Task Manager</h1>

      <div className="flex gap-8">
        {/* Left Column: Task List */}
        <div className="w-3/5">
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
        <div className="w-2/5 h-[calc(100dvh-6rem)]">
          <DailyScheduleView
            scheduledBlocks={scheduledBlocks}
            tasks={tasks}
            // Possibly pass Google Calendar events or handle drag-drop callbacks
          />
        </div>
      </div>
    </main>
  );
}
