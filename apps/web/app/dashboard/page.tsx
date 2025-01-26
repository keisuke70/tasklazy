"use client";

import { useState } from "react";
import { TaskInput } from "@/components/TaskInput";
import { TaskList } from "@/components/TaskList";
import { DaySelector } from "@/components/DaySelector";
import { Button } from "@/components/ui/button";
import { Task, Category } from "@/lib/definition";
import { SlackIntegration } from "@/components/SlackIntegration";

// Example UUIDs for each category (you can generate your own).
const workCategoryId = "f3f7b915-4b3c-4f5b-a4cc-43bb93cd988a";
const choresCategoryId = "3947b981-e0af-4421-bfcc-1b3bec6e4470";
const personalCategoryId = "58aa587c-8b7e-4046-ab08-f5f71975dde8";

// Updated Categories
export const initialCategories: Category[] = [
  {
    id: workCategoryId,
    name: "Work",
    color: "bg-blue-100",
    defaultTime: 60,
    preferredTime: "morning",
  },
  {
    id: choresCategoryId,
    name: "Chores",
    color: "bg-green-100",
    defaultTime: 30,
    preferredTime: "noon",
  },
  {
    id: personalCategoryId,
    name: "Personal",
    color: "bg-purple-100",
    defaultTime: 45,
    preferredTime: "night",
  },
];

// Updated Tasks
const initialTasks: Task[] = [
  {
    id: 1,
    text: "Finish project proposal",
    timeToComplete: 60,
    preferredTime: "morning",
    selectedDates: [],
    dueDate: new Date("2025-01-15"),
    recurringSettings: "none",
    categoryId: workCategoryId,
  },
  {
    id: 2,
    text: "Schedule team meeting",
    preferredTime: "morning",
    selectedDates: [],
    dueDate: new Date("2025-01-16"),
    recurringSettings: "weekly",
    categoryId: workCategoryId,
  },
  {
    id: 3,
    text: "Do laundry",
    timeToComplete: 30,
    preferredTime: "noon",
    selectedDates: [],
    dueDate: new Date("2025-01-10"),
    recurringSettings: "weekly",
    categoryId: choresCategoryId,
  },
  {
    id: 4,
    text: "Clean kitchen",
    timeToComplete: 20,
    preferredTime: "noon",
    selectedDates: [],
    dueDate: null,
    recurringSettings: "daily",
    categoryId: choresCategoryId,
  },
  {
    id: 5,
    text: "Call mom",
    timeToComplete: 45,
    preferredTime: "night",
    selectedDates: [],
    dueDate: new Date("2025-01-12"),
    recurringSettings: "weekly",
    categoryId: personalCategoryId,
  },
  {
    id: 6,
    text: "Go for a run",
    timeToComplete: 30,
    preferredTime: "night",
    selectedDates: [],
    dueDate: null,
    recurringSettings: "daily",
    categoryId: personalCategoryId,
  },
];

const exampleUnrepliedMessages = [
  {
    sender: "John",
    content:
      "Hey, can you take a look at the code for the user authentication?",
  },
  {
    sender: "Alice",
    content: "There is a bug in the checkout flow, can you help me fix it?",
  },
  {
    sender: "Bob",
    content: "What do you think about the new design for the landing page?",
  },
];

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  const handleAddTasks = async (inputText: string) => {
    if (!inputText.trim()) return;

    try {
      const response = await fetch("/api/process-tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: inputText }),
      });

      if (!response.ok) throw new Error("Failed to process tasks");

      const result: Task[] = await response.json();
      setTasks((prevTasks) => [...prevTasks, ...result]);
    } catch (error) {
      console.error("Error submitting tasks:", error);
    }
  };

  const handleGenerateSchedule = () => {
    console.log("Generating schedule for:", selectedDate);
  };
  const handleDeleteSchedule = () => {
    console.log("Delete selected schedule", selectedDate);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">TaskLazy Dashboard</h1>

      <div className="grid grid-cols-10 gap-4 mb-8">
        <div className="col-span-7 bg-gray-50 p-4 rounded-lg shadow-md">
          <TaskList
            tasks={tasks}
            setTasks={setTasks}
            categories={categories}
            setCategories={setCategories}
            selectedDate={selectedDate}
          />
        </div>

        <div className="col-span-3 flex flex-col bg-gray-100 p-4 rounded-lg shadow-md gap-4">
          <DaySelector
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />

          <SlackIntegration unrepliedMessages={exampleUnrepliedMessages} />
        </div>
      </div>

      <div className="px-4 py-2 flex-row space-x-4">
        <Button
          onClick={handleGenerateSchedule}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Generate Schedule
        </Button>
        <Button
          onClick={handleDeleteSchedule}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          delete selected
        </Button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <TaskInput onAddTasks={handleAddTasks} />
      </div>
    </div>
  );
}
