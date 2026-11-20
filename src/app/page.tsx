"use client";

import { useState, useMemo, useEffect, useSyncExternalStore } from "react";
import Image from "next/image";
import {
  Plant,
  Sparkle,
  Bell,
  Wallet,
  Heart,
  Sun,
  CaretRight,
  Plus,
  House,
  Mountains,
  CalendarBlank,
} from "@phosphor-icons/react";
import Drawer from "@/components/drawer";
import AddTaskForm, { TaskFormData } from "@/components/add-task-form";
import UpdateFundsForm from "@/components/update-funds-form";
import SwipeableTaskItem, { TaskItem } from "@/components/swipeable-task-item";
import { useHydratedFunds } from "@/store/funds-store";

const STORAGE_KEY = "kimba_tasks";

const initialTasks: TaskItem[] = [
  { id: "2", title: "Practice coding", completed: false },
  { id: "3", title: "Buy groceries", completed: false },
  { id: "1", title: "Read 20 pages", completed: true },
];

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("kimba-tasks-update", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("kimba-tasks-update", callback);
  };
}

function getSnapshot() {
  return localStorage.getItem(STORAGE_KEY) ?? "";
}

function getServerSnapshot() {
  return "";
}

export default function Home() {
  const [activeDrawer, setActiveDrawer] = useState<"task" | "funds" | null>(null);
  const [removedTask, setRemovedTask] = useState<{
    task: TaskItem;
    index: number;
  } | null>(null);
  const [statusMessage, setStatusMessage] = useState("");

  const funds = useHydratedFunds();

  const tasksString = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const tasks = useMemo<TaskItem[]>(() => {
    let rawList: TaskItem[];
    if (!tasksString) {
      rawList = initialTasks;
    } else {
      try {
        const parsed = JSON.parse(tasksString);
        rawList = Array.isArray(parsed) ? parsed : initialTasks;
      } catch {
        rawList = initialTasks;
      }
    }
    const unfinished = rawList.filter((task) => !task.completed);
    const completed = rawList.filter((task) => task.completed);
    return [...unfinished, ...completed];
  }, [tasksString]);

  useEffect(() => {
    if (!removedTask) return;
    const timeoutId = setTimeout(() => {
      setRemovedTask(null);
    }, 4000);
    return () => clearTimeout(timeoutId);
  }, [removedTask]);

  const saveTasks = (updatedTasks: TaskItem[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    window.dispatchEvent(new Event("kimba-tasks-update"));
  };

  const handleToggleTask = (id: string) => {
    const target = tasks.find((task) => task.id === id);
    if (!target) return;

    const nextCompleted = !target.completed;
    const updatedTask = { ...target, completed: nextCompleted };
    const others = tasks.filter((task) => task.id !== id);

    const unfinished = others.filter((task) => !task.completed);
    const completed = others.filter((task) => task.completed);

    const updatedTasks = nextCompleted
      ? [...unfinished, ...completed, updatedTask]
      : [...unfinished, updatedTask, ...completed];

    saveTasks(updatedTasks);
  };

  const handleRemoveTask = (id: string) => {
    const index = tasks.findIndex((task) => task.id === id);
    const target = tasks[index];
    if (!target) return;

    const nextTasks = tasks.filter((task) => task.id !== id);
    saveTasks(nextTasks);
    setRemovedTask({ task: target, index });
    setStatusMessage(`Task "${target.title}" removed`);
  };

  const handleUndo = () => {
    if (!removedTask) return;
    const nextTasks = [...tasks];
    const targetIndex = Math.min(removedTask.index, nextTasks.length);
    nextTasks.splice(targetIndex, 0, removedTask.task);
    saveTasks(nextTasks);
    setStatusMessage(`Task "${removedTask.task.title}" restored`);
    setRemovedTask(null);
  };

  const handleAddTask = (formData: TaskFormData) => {
    const newTask: TaskItem = {
      id: Date.now().toString(),
      title: formData.title,
      note: formData.note,
      date: formData.date,
      completed: false,
    };

    const unfinished = tasks.filter((task) => !task.completed);
    const completed = tasks.filter((task) => task.completed);

    saveTasks([...unfinished, newTask, ...completed]);
    setActiveDrawer(null);
  };

  const remainingCount = tasks.filter((task) => !task.completed).length;

  return (
    <div className="flex flex-col min-h-dvh w-full max-w-full bg-app text-primary overflow-x-hidden">
      <main className="flex flex-col flex-1 p-4 pb-[calc(max(0.5rem,env(safe-area-inset-bottom))+6rem)] gap-4 max-w-lg mx-auto w-full box-border">
        <header className="flex flex-col gap-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Plant size={22} weight="fill" className="text-green-accent" />
              <h1 className="text-base font-medium">Kimba</h1>
              <Sparkle size={16} weight="fill" className="text-yellow-accent" />
            </div>
            <button
              type="button"
              aria-label="Notifications"
              className="relative p-1 text-primary hover:opacity-80 transition-opacity"
            >
              <Bell size={22} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pink-accent" />
            </button>
          </div>

          <div className="relative flex items-end justify-between gap-2 pt-1">
            <div className="flex flex-col gap-1 pb-1 z-10 min-w-0">
              <h2 className="text-2xl text-primary">
                Good{" "}
                <span className="relative inline-block">
                  morning!
                  <svg
                    className="absolute left-0 -bottom-1 w-[80%] h-2 text-purple-primary"
                    viewBox="0 0 100 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M2 8C28 12 72 12 98 6"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h2>
              <p className="text-sm text-secondary font-normal">Let&apos;s make today count 💜</p>
            </div>
            <div className="relative w-[48%] max-w-[210px] min-w-[140px] shrink-0 select-none pointer-events-none -mb-1">
              <Image
                src="/Dreamy Sleeping Cat bg.png"
                alt="Dreamy sleeping cat"
                width={1774}
                height={887}
                priority
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </header>

        <section className="flex gap-3 w-full">
          <button
            type="button"
            onClick={() => setActiveDrawer("funds")}
            className="flex flex-1 min-w-0 items-center justify-between p-3 sm:p-3.5 bg-green-tint rounded-card border-[3px] border-white shadow-card text-left transition-all hover:opacity-90 active:scale-[0.99] cursor-pointer"
          >
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <Wallet size={36} weight="duotone" className="text-green-accent shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-normal text-primary truncate">My Funds</span>
                <span className="text-base sm:text-lg font-medium text-green-accent truncate">
                  ₹{funds.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
            <CaretRight size={18} className="text-secondary shrink-0 ml-1" />
          </button>

          <div className="flex flex-1 min-w-0 items-center justify-between p-3 sm:p-3.5 bg-pink-tint rounded-card border-[3px] border-white shadow-card">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <Heart size={36} weight="duotone" className="text-pink-accent shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-normal text-primary truncate">Wishlist</span>
                <span className="text-base sm:text-lg font-medium text-primary truncate">
                  8 <span className="text-xs sm:text-sm font-normal">items</span>
                </span>
              </div>
            </div>
            <CaretRight size={18} className="text-secondary shrink-0 ml-1" />
          </div>
        </section>

        <section className="flex flex-col gap-3 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sun size={24} weight="regular" className="text-yellow-accent shrink-0" />
              <h3 id="tasks-heading" className="text-base sm:text-lg font-medium text-primary">
                Today&apos;s Tasks
              </h3>
            </div>
            <span className="text-sm sm:text-base font-normal text-secondary">
              {remainingCount} left
            </span>
          </div>

          <p role="status" className="sr-only">
            {statusMessage}
          </p>

          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center gap-2 bg-surface rounded-card border border-border-subtle shadow-card w-full">
              <Sparkle size={32} weight="fill" className="text-yellow-accent" />
              <span className="text-base font-medium text-primary">All tasks completed!</span>
              <span className="text-xs text-secondary font-normal">
                Enjoy your day or add a new task with the + button.
              </span>
            </div>
          ) : (
            <ul role="list" aria-labelledby="tasks-heading" className="task-list">
              {tasks.map((task) => (
                <SwipeableTaskItem
                  key={task.id}
                  task={task}
                  onToggle={handleToggleTask}
                  onRemove={handleRemoveTask}
                />
              ))}
            </ul>
          )}
        </section>

        <section className="flex flex-col gap-2 w-full">
          <div className="flex items-center gap-1.5">
            <Mountains size={20} weight="fill" className="text-green-accent" />
            <h3 className="text-sm font-medium text-primary">Active Mission</h3>
          </div>

          <div className="flex items-center justify-between p-4 bg-surface rounded-card border border-border-subtle shadow-card w-full">
            <div className="flex flex-col gap-2 flex-1 min-w-0 pr-3">
              <span className="text-sm font-normal text-primary truncate">Plan a Darjeeling Trip</span>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 rounded-full bg-track overflow-hidden">
                  <div className="h-full bg-green-accent rounded-full w-[40%]"></div>
                </div>
                <span className="text-xs font-medium text-green-accent shrink-0">40%</span>
              </div>
            </div>
            <CaretRight size={16} className="text-muted shrink-0" />
          </div>
        </section>
      </main>

      <button
        type="button"
        onClick={() => setActiveDrawer("task")}
        aria-label="Add new task"
        className="fixed bottom-[calc(max(0.5rem,env(safe-area-inset-bottom))+4.25rem)] right-4 sm:right-[max(1rem,calc(50%-15rem))] flex items-center justify-center w-14 h-14 rounded-full bg-purple-primary text-white shadow-fab z-30 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
      >
        <Plus size={26} weight="bold" />
      </button>

      <Drawer
        isOpen={activeDrawer !== null}
        onClose={() => setActiveDrawer(null)}
        title={
          activeDrawer === "funds" ? (
            <div className="flex items-center gap-2.5">
              <Wallet size={28} weight="duotone" className="text-green-accent" />
              <h2 className="text-xl sm:text-2xl font-medium text-primary">
                Update Funds
              </h2>
            </div>
          ) : (
            "Add Task"
          )
        }
      >
        {activeDrawer === "funds" ? (
          <UpdateFundsForm onSuccess={() => setActiveDrawer(null)} />
        ) : (
          <AddTaskForm onSubmit={handleAddTask} />
        )}
      </Drawer>

      {removedTask ? (
        <div className="toast-container">
          <span className="text-sm font-normal truncate pr-2">
            Task &ldquo;{removedTask.task.title}&rdquo; removed
          </span>
          <button
            type="button"
            onClick={handleUndo}
            className="toast-undo-btn"
          >
            Undo
          </button>
        </div>
      ) : null}

      <nav className="fixed bottom-0 left-0 right-0 z-20 flex items-center justify-around pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] px-2 bg-surface border-t border-border-subtle shadow-nav max-w-lg mx-auto w-full">
        <button type="button" className="flex flex-1 flex-col items-center gap-1 py-1 px-1 rounded-xl bg-surface-tint text-purple-primary">
          <House size={20} weight="fill" />
          <span className="text-[11px] font-medium">Home</span>
        </button>
        <button type="button" className="flex flex-1 flex-col items-center gap-1 py-1 px-1 text-secondary">
          <Heart size={20} />
          <span className="text-[11px] font-normal">Wishlist</span>
        </button>
        <button type="button" className="flex flex-1 flex-col items-center gap-1 py-1 px-1 text-secondary">
          <Sun size={20} />
          <span className="text-[11px] font-normal">Daily</span>
        </button>
        <button type="button" className="flex flex-1 flex-col items-center gap-1 py-1 px-1 text-secondary">
          <Mountains size={20} />
          <span className="text-[11px] font-normal">Missions</span>
        </button>
        <button type="button" className="flex flex-1 flex-col items-center gap-1 py-1 px-1 text-secondary">
          <CalendarBlank size={20} />
          <span className="text-[11px] font-normal">Calendar</span>
        </button>
      </nav>
    </div>
  );
}
