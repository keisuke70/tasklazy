"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Settings, Plus } from "lucide-react";
import { TaskModal } from "@/components/TaskModal";
import { TaskCard } from "@/components/TaskCard";
import { CategorySettingsModal } from "@/components/CategorySettingsModal";
import { Task, Category, DateWithPriority } from "@/lib/definition";

interface TaskListProps {
  selectedDate: Date;
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  categories: Category[];
  setCategories: (categories: Category[]) => void;
}

export function TaskList({
  selectedDate,
  tasks,
  setTasks,
  categories,
  setCategories,
}: TaskListProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    categories.map((c) => c.name)
  );
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  /**
   * Expand or collapse categories
   */
  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((name) => name !== categoryName)
        : [...prev, categoryName]
    );
  };

  /**
   * Find the DateWithPriority in a task for the given `selectedDate`.
   */
  function getPriorityForDate(task: Task, date: Date): number | undefined {
    return task.selectedDates.find(
      (dwp) => dwp.date.getTime() === date.getTime()
    )?.priority;
  }

  /**
   * Toggle selection & priority for the clicked task, for the current `selectedDate`.
   *
   * If the task is NOT selected for `selectedDate`, we add it and set its priority
   * to (1 + how many tasks are already selected for that date).
   *
   * If the task IS already selected, we remove it from that date.
   *
   * Then we reassign priorities for all tasks that remain selected for that date.
   */
  const toggleDateAndPriority = (taskId: number) => {
    // First, clone tasks to prepare an updated version
    let updatedTasks = [...tasks];

    // Identify if the clicked task is currently selected
    const clickedTaskIndex = updatedTasks.findIndex((t) => t.id === taskId);
    if (clickedTaskIndex === -1) return; // safety check

    const clickedTask = updatedTasks[clickedTaskIndex];
    const existingDwpIndex = clickedTask.selectedDates.findIndex(
      (dwp) => dwp.date.getTime() === selectedDate.getTime()
    );

    // If not selected => add new date+priority
    if (existingDwpIndex === -1) {
      // find how many tasks are already selected for this date
      const tasksForThisDate = updatedTasks.filter((t) =>
        t.selectedDates.some(
          (dwp) => dwp.date.getTime() === selectedDate.getTime()
        )
      );

      // Next available priority is tasksForThisDate.length + 1
      const newPriority = tasksForThisDate.length + 1;

      const newDwp: DateWithPriority = {
        date: selectedDate,
        priority: newPriority,
      };

      // Add to the array
      clickedTask.selectedDates = [...clickedTask.selectedDates, newDwp];
    } else {
      // Already selected => remove it
      clickedTask.selectedDates = clickedTask.selectedDates.filter(
        (dwp) => dwp.date.getTime() !== selectedDate.getTime()
      );
    }

    // Put the updated clickedTask back in the array
    updatedTasks[clickedTaskIndex] = { ...clickedTask };

    // Reassign priorities among all tasks that are still selected for `selectedDate`.
    updatedTasks = reassignPrioritiesForDate(updatedTasks, selectedDate);

    // Finally, update state
    setTasks(updatedTasks);
  };

  /**
   * After we add/remove a task for a particular date,
   * we want to ensure the tasks that remain selected for that date
   * have priorities 1..N in the order they were (last) clicked.
   *
   * The simplest approach: collect all tasks that have this date,
   * sort them by the *existing* priority, then reassign from 1..N in that order.
   */
  function reassignPrioritiesForDate(allTasks: Task[], date: Date): Task[] {
    const tasksForDate = allTasks
      .filter((task) => getPriorityForDate(task, date))
      // sort by priority ascending
      .sort((a, b) => {
        const prioA = getPriorityForDate(a, date)!;
        const prioB = getPriorityForDate(b, date)!;
        return prioA - prioB;
      });

    // 2) Reassign them 1..N
    tasksForDate.forEach((task, index) => {
      const newPriority = index + 1; // 1-based
      task.selectedDates = task.selectedDates.map((dwp) =>
        dwp.date.getTime() === date.getTime()
          ? { ...dwp, priority: newPriority }
          : dwp
      );
    });

    return allTasks;
  }

  // For opening/closing Task Modal (existing logic)
  const openTaskModal = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };
  const closeTaskModal = () => {
    setSelectedTask(null);
    setIsTaskModalOpen(false);
  };
  const saveTask = (updatedTask: Task) => {
    const updatedTasks = tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
    setTasks(updatedTasks);
    closeTaskModal();
  };

  // Category Modal (existing logic)
  const openCategoryModal = (category: Category | null = null) => {
    setCategoryToEdit(category);
    setIsCategoryModalOpen(true);
  };
  const closeCategoryModal = () => {
    setCategoryToEdit(null);
    setIsCategoryModalOpen(false);
  };
  const saveCategory = (categorySettings: Category) => {
    if (categoryToEdit) {
      const updatedCategories = categories.map((cat) =>
        cat.name === categoryToEdit.name ? { ...categorySettings } : cat
      );
      setCategories(updatedCategories);
    } else {
      setCategories([...categories, { ...categorySettings }]);
    }
    closeCategoryModal();
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Tasks</h2>
        <Button
          variant="outline"
          size="icon"
          onClick={() => openCategoryModal()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {categories.map((category) => (
        <div
          key={category.name}
          className={`mb-4 rounded-lg ${category.color}`}
        >
          <div className="flex items-center justify-between p-4">
            <Button
              variant="ghost"
              className="flex-grow justify-start"
              onClick={() => toggleCategory(category.name)}
            >
              <span className="text-lg font-medium">{category.name}</span>
              {expandedCategories.includes(category.name) ? (
                <ChevronUp className="ml-2" />
              ) : (
                <ChevronDown className="ml-2" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => openCategoryModal(category)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>

          {expandedCategories.includes(category.name) && (
            <div className="p-4 pt-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 justify-items-start">
              {tasks
                .filter((task) => task.preferredTime === category.preferredTime)
                .map((task) => {
                  const priority = getPriorityForDate(task, selectedDate);

                  return (
                    <TaskCard
                      key={task.id}
                      task={task}
                      priorityForSelectedDate={priority}
                      onTogglePriority={() => toggleDateAndPriority(task.id)}
                      onSetDetail={() => openTaskModal(task)}
                    />
                  );
                })}
            </div>
          )}
        </div>
      ))}

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          isOpen={isTaskModalOpen}
          onClose={closeTaskModal}
          onSave={saveTask}
        />
      )}

      <CategorySettingsModal
        isOpen={isCategoryModalOpen}
        onClose={closeCategoryModal}
        category={categoryToEdit}
        onSave={saveCategory}
      />
    </div>
  );
}
