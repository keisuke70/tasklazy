import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, Repeat as RepeatIcon } from "lucide-react";
import { format } from "date-fns";
import { Task } from "@/lib/definition";

type TaskCardProps = {
  task: Task;
  priorityForSelectedDate: number | undefined;
  onTogglePriority: () => void;
  onSetDetail: () => void;
};

export function TaskCard({
  task,
  priorityForSelectedDate,
  onTogglePriority,
  onSetDetail,
}: TaskCardProps) {
  const hasPriority = priorityForSelectedDate !== undefined;

  return (
    <Card
      className={`relative w-full rounded-xl sm:w-32 md:w-52 max-w-xs cursor-pointer transition-colors 
        ${hasPriority ? "bg-gray-300" : "bg-white"}
      `}
      onClick={onTogglePriority}
    >
      {hasPriority && (
        <div
          className="
            absolute 
            top-0 left-0 
            w-full h-full
            rounded-xl
            bg-black/30 
            flex items-center justify-center 
            z-10
          "
        >
          <span className="text-6xl font-bold text-white/80">
            {priorityForSelectedDate}
          </span>
        </div>
      )}

      <CardContent className="p-4 flex flex-col justify-between min-h-full">
        <div>
          <div className="flex flex-col items-start mb-2">
            <span
              className={`text-sm  ${
                hasPriority ? "text-white z-50 font-bold" : "text-gray-900"
              }`}
            >
              {task.text}
            </span>
          </div>

          <div className="flex items-center text-sm text-gray-500 space-x-2">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {task.timeToComplete} min
            </div>
            {task.dueDate && (
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {format(task.dueDate, "MMM d")}
              </div>
            )}
            {task.recurringSettings !== "none" && (
              <div className="flex items-center">
                <RepeatIcon className="w-4 h-4 mr-1" />
                {task.recurringSettings}
              </div>
            )}
          </div>
        </div>

        <div className="mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onSetDetail();
            }}
            className={`${hasPriority ? "z-60": ""}`} //revise here later
          >
            Set Detail
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
