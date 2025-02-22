"use client";

import React, { useEffect, useState } from "react";
import TaskRegistrationPanel from "@/components/TaskRegistrationPanel";
import TaskListTable from "@/components/TaskListTable";
import GenerateScheduleButton from "@/components/GenerateScheduleButton";
import DailyScheduleView from "@/components/DailyScheduleView";
import { Task, ScheduledBlock, RepeatOption } from "@/lib/definition";
import { useSidebar } from "@/components/ui/sidebar";
import { useUser } from "@/context/UserContext";


export default function HomePage() {
  const userId = useUser()?.userId!;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [scheduledBlocks, setScheduledBlocks] = useState<ScheduledBlock[]>([]);
  const { setOpen } = useSidebar();
  const [editDetails, setEditDetails] = useState(false);

  useEffect(() => {
    if (editDetails) {
      setOpen(false);
    }
  }, [editDetails, setOpen]);

  // Fetch tasks from your Lambda API Gateway endpoint
  useEffect(() => {
    async function fetchTasks() {
      try {
        // Replace with your actual API Gateway URL
        const response = await fetch(
          `https://s6finx4jva.execute-api.us-west-1.amazonaws.com/dev/fetch-task?userId=8989294e-f071-70b4-7799-7e0ff01d9937`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    }

    if (userId) {
      fetchTasks();
    }
  }, [userId]);

  useEffect(() => {
    if (editDetails) {
      // Close the sidebar when editDetails is true
      setOpen(false);
    }
  }, [editDetails, setOpen]);
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

    // Hard-coded scheduled blocks for demonstration:
    const newScheduledBlocks: ScheduledBlock[] = [
      {
        taskId: "task1",
        priority: 1,
        startTime: "08:00",
      },
      {
        taskId: "task2",
        priority: 2,
        startTime: "08:50",
      },
      {
        taskId: "task3",
        priority: 3,
        startTime: "10:15",
      },
      {
        taskId: "task4",
        priority: 4,
        startTime: "11:10",
      },
      {
        taskId: "task5",
        priority: 5,
        startTime: "13:30",
      },
    ];

    // 3. In a real implementation you might:
    // await fetch("/api/generate-schedule", { method: "POST", body: JSON.stringify(prioritizedTasks) })
    setScheduledBlocks(newScheduledBlocks);
  };

  /**
   * 1. The function that updates a block's `startTime` when dragged-and-dropped.
   *    `taskId` is the block's ID, `newStartTime` is the new "HH:mm".
   */
  const handleTaskMove = (taskId: string, newStartTime: string) => {
    setScheduledBlocks((prevBlocks) =>
      prevBlocks.map((block) =>
        block.taskId === taskId ? { ...block, startTime: newStartTime } : block
      )
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  return (
    <div className="flex pt-5 gap-8 h-full w-full">
      <div className="w-4/6 h-full">
        <div className="pl-5 h-4/5">
          <TaskListTable
            tasks={tasks}
            onUpdateTask={handleUpdateTask}
            onToggleComplete={handleToggleComplete}
            onSetPriority={handleSetPriority}
            onDeleteTask={handleDeleteTask}
            editDetails={editDetails}
            setEditDetails={setEditDetails}
          />
        </div>
        <div className="flex justify-center mt-5">
          <div className="w-full ml-20">
            <TaskRegistrationPanel onAddTask={handleAddTask} />
          </div>
          <div className="ml-3 mt-1">
            <GenerateScheduleButton
              tasks={tasks}
              onGenerateSchedule={handleGenerateSchedule}
            />
          </div>
        </div>
      </div>

      {/* Right Column: Daily Schedule View – flex-grow factor of 1 */}
      <div className="w-2/6 p-2 mb-2">
        <DailyScheduleView
          scheduledBlocks={scheduledBlocks}
          tasks={tasks}
          onTaskMove={handleTaskMove}
        />
      </div>
    </div>
  );
}
