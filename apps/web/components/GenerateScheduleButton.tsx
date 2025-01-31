"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Task } from "@/lib/definition";


interface GenerateScheduleButtonProps {
  tasks: Task[];
  onGenerateSchedule: () => Promise<void> | void;
}

export default function GenerateScheduleButton({
  tasks,
  onGenerateSchedule,
}: GenerateScheduleButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleClick = async () => {
    // Optional: We can check if there are any prioritized tasks:
    const prioritizedTasks = tasks.filter((t) => t.priority !== undefined);
    if (prioritizedTasks.length === 0) {
      toast({
        title: "No tasks prioritized",
        description: "Please assign priority to at least one task.",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Call the parent’s scheduling function
      await onGenerateSchedule();
      toast({
        title: "Schedule Generated",
        description: "Your new schedule has been created successfully.",
      });
    } catch (error) {
      console.error("Error generating schedule:", error);
      toast({
        title: "Error",
        description: "Failed to generate schedule. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-6 px-8 rounded-full 
                 transition-all duration-200 ease-in-out transform hover:scale-105 
                 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        "Generate Schedule"
      )}
    </Button>
  );
}
