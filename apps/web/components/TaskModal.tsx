import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Task, Category } from "@/lib/definition";

/**
 * Example function to fetch a category by ID.
 * Replace with your real API call or data-fetching logic.
 */
async function fetchCategory(categoryId: string): Promise<Category> {
  const response = await fetch(`/api/categories/${categoryId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch category");
  }
  return (await response.json()) as Category;
}

type TaskModalProps = {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTask: Task) => void;
};

export function TaskModal({ task, isOpen, onClose, onSave }: TaskModalProps) {
  /**
   * We keep a local copy of the task in component state so we can
   * update the fields (timeToComplete, preferredTime, etc.) as the user edits.
   */
  const [editedTask, setEditedTask] = useState<Task>(task);

  /**
   * We'll store the fetched Category in state. Once we have it,
   * we can apply defaults (if needed) to the task.
   */
  const [category, setCategory] = useState<Category | null>(null);

  /**
   * If the task’s categoryId changes, fetch the matching Category.
   */
  useEffect(() => {
    if (task.categoryId) {
      fetchCategory(task.categoryId)
        .then((cat) => setCategory(cat))
        .catch((error) => {
          console.error("Error fetching category:", error);
          setCategory(null);
        });
    }
  }, [task.categoryId]);

  /**
   * Whenever we successfully fetch (or refetch) a category, we can apply
   * its defaultTime / preferredTime if the task’s fields are missing or "none".
   */
  useEffect(() => {
    if (category) {
      setEditedTask((prev) => {
        // Use category defaults only if the task has not specified them
        const updatedTimeToComplete =
          prev.timeToComplete === undefined
            ? category.defaultTime
            : prev.timeToComplete;

        const updatedPreferredTime =
          prev.preferredTime === "none"
            ? category.preferredTime
            : prev.preferredTime;

        return {
          ...prev,
          timeToComplete: updatedTimeToComplete,
          preferredTime: updatedPreferredTime,
        };
      });
    }
  }, [category]);

  /**
   * If the parent passes in a new `task` object, update the local state too.
   */
  useEffect(() => {
    setEditedTask(task);
  }, [task]);

  const handleSave = () => {
    onSave(editedTask);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Task Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Task Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="taskName" className="text-right">
              Task
            </Label>
            <Input
              id="taskName"
              value={editedTask.text}
              onChange={(e) =>
                setEditedTask({
                  ...editedTask,
                  text: e.target.value,
                })
              }
              className="col-span-3"
            />
          </div>

          {/* Time to Complete */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="timeToComplete" className="text-right">
              Time to Complete (minutes)
            </Label>
            <Input
              id="timeToComplete"
              type="number"
              value={editedTask.timeToComplete ?? ""}
              onChange={(e) =>
                setEditedTask({
                  ...editedTask,
                  timeToComplete: parseInt(e.target.value),
                })
              }
              className="col-span-3"
            />
          </div>

          {/* Preferred Time */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="preferredTime" className="text-right">
              Preferred Time
            </Label>
            <Select
              value={editedTask.preferredTime}
              onValueChange={(value) =>
                setEditedTask({
                  ...editedTask,
                  preferredTime: value as "none" | "morning" | "noon" | "night",
                })
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select preferred time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="morning">Morning</SelectItem>
                <SelectItem value="noon">Noon</SelectItem>
                <SelectItem value="night">Night</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Due Date */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dueDate" className="text-right">
              Due Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="dueDate"
                  variant="outline"
                  className={`col-span-3 justify-start text-left font-normal ${
                    !editedTask.dueDate && "text-muted-foreground"
                  }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {editedTask.dueDate
                    ? format(editedTask.dueDate, "PPP")
                    : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={editedTask.dueDate || undefined}
                  onSelect={(date) =>
                    setEditedTask({
                      ...editedTask,
                      dueDate: date || null,
                    })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Recurring Settings */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="recurringSettings" className="text-right">
              Recurring
            </Label>
            <Select
              value={editedTask.recurringSettings}
              onValueChange={(value) =>
                setEditedTask({
                  ...editedTask,
                  recurringSettings: value as
                    | "none"
                    | "daily"
                    | "weekly"
                    | "monthly",
                })
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select recurring option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSave}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
