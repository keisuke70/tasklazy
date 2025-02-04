"use client";

import { useState } from "react";
import { Mic, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Task } from "@/lib/definition";

interface TaskRegistrationPanelProps {
  onAddTask: (newTask: Task) => void;
}

export default function TaskRegistrationPanel({
  onAddTask,
}: TaskRegistrationPanelProps) {
  const [taskInput, setTaskInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleParseAndAddTasks = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!taskInput.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/parse-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskDescription: taskInput }),
      });
      if (!response.ok) {
        throw new Error("Failed to parse tasks");
      }
      const tasks = (await response.json()) as Task[];

      // Add each task to the task list
      tasks.forEach((task) => onAddTask(task));

      toast({
        title: "Success",
        description: "Tasks added successfully!",
      });

      setTaskInput("");
    } catch (error) {
      console.error("Error parsing tasks:", error);
      toast({
        title: "Error",
        description: "Failed to add tasks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full mx-auto">
      <CardContent className="p-2">
        <form onSubmit={handleParseAndAddTasks} className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              placeholder="Enter your task..."
              className="flex-grow mr-1"
            />
            <Button
              type="submit"
              className="h-11 w-11" // Overrides the default height/width
              variant="outline"
              disabled={isLoading}
            >
              {taskInput.trim().length === 0 ? (
                <Mic className="h-8 w-8" /> // Larger icon size
              ) : (
                <Plus className="h-8 w-8" />
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
