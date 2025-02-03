"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Task } from "@/lib/definition";

/**
 * ParsedTask is the shape returned by /api/parse-task.
 * It may be partial or slightly different from our Task interface.
 */
interface ParsedTask {
  taskName: string;
  dueDate: string;
  timeRequired: string;
  repeatRule: string;
}

/**
 * Props for TaskRegistrationPanel
 */
interface TaskRegistrationPanelProps {
  /**
   * Called after the server successfully creates the task,
   * allowing the parent to add it to state.
   */
  onAddTask: (newTask: Task) => void;
}

export default function TaskRegistrationPanel({
  onAddTask,
}: TaskRegistrationPanelProps) {
  const [taskInput, setTaskInput] = useState("");
  const [parsedTask, setParsedTask] = useState<ParsedTask | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // react-hook-form to handle the final confirmation fields
  const { register, handleSubmit, reset } = useForm<ParsedTask>();

  /**
   * Step 1: Parse the user’s input by calling /api/parse-task
   */
  const handleParseTask = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/parse-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskDescription: taskInput }),
      });
      if (!response.ok) {
        throw new Error("Failed to parse task");
      }
      const data = (await response.json()) as ParsedTask;
      setParsedTask(data);
    } catch (error) {
      console.error("Error parsing task:", error);
      toast({
        title: "Error",
        description: "Failed to parse task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Step 2: Confirm the parsed data and create the new task via /api/tasks
   * Then call onAddTask with the server’s response (which we assume is a Task).
   */
  const onSubmit = async (data: ParsedTask) => {
    setIsLoading(true);
    try {
      // Send the parsed/confirmed data to create the task
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      // Assume the server returns a Task object that matches our interface
      const createdTask = (await response.json()) as Task;

      // Pass the new task up to the parent
      onAddTask(createdTask);

      toast({
        title: "Success",
        description: "Task created successfully!",
      });

      // Reset local states
      setTaskInput("");
      setParsedTask(null);
      reset();
    } catch (error) {
      console.error("Error creating task:", error);
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-4">
        {/* First form: the user’s raw input to parse */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleParseTask();
          }}
          className="space-y-4"
        >
          <div className="flex items-center space-x-2">
            <Input
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              placeholder="Enter your task..."
              className="flex-grow"
            />
            <Button type="button" size="icon" variant="outline">
              <Mic className="h-4 w-4" />
            </Button>
          </div>
          <Button type="submit" className="w-full h-8" disabled={isLoading}>
            {isLoading ? "Processing..." : "Add Task"}
          </Button>
        </form>

        {/* Second form: confirmation & editing of the parsed task */}
        <AnimatePresence>
          {parsedTask && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-4 space-y-4"
              >
                <Input
                  {...register("taskName")}
                  defaultValue={parsedTask.taskName}
                  placeholder="Task Name"
                />
                <Input
                  {...register("dueDate")}
                  defaultValue={parsedTask.dueDate}
                  type="date"
                />
                <Input
                  {...register("timeRequired")}
                  defaultValue={parsedTask.timeRequired}
                  placeholder="Time Required"
                />
                <Input
                  {...register("repeatRule")}
                  defaultValue={parsedTask.repeatRule}
                  placeholder="Repeat Rule"
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Confirm Task"}
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
