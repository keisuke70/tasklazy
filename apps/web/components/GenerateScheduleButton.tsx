"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
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
  const TOAST_DURATION = 2000;

  const handleClick = async () => {
    // Check for prioritized tasks
    const prioritizedTasks = tasks.filter((t) => t.priority !== undefined);
    if (prioritizedTasks.length === 0) {
      toast({
        title: "No tasks prioritized",
        description: "Please assign priority to at least one task.",
        duration: TOAST_DURATION,
      });
      return;
    }

    setIsLoading(true);
    try {
      await onGenerateSchedule();
      toast({
        title: "Schedule Generated",
        description: "Your new schedule has been created successfully.",
        duration: TOAST_DURATION,
      });
    } catch (error) {
      console.error("Error generating schedule:", error);
      toast({
        title: "Error",
        description: "Failed to generate schedule. Please try again.",
        variant: "destructive",
        duration: TOAST_DURATION,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      className="
        bg-primary 
        text-primary-foreground 
        hover:bg-primary/90 
        transition-all 
        duration-200 
        ease-in-out 
        transform 
        hover:scale-105 
        focus:outline-none 
        focus:ring-2 
        focus:ring-primary 
        focus:ring-opacity-50 
        w-20 h-15
      "
    >
      {isLoading ? (
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="mt-2 text-sm">Generating...</span>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <span className="text-sm font-medium">Schedule</span>
          <ArrowRight className="h-3 w-3" />
        </div>
      )}
    </Button>
  );
}
