"use client";

import { useState } from "react";
import {
  PencilSimple,
  Note,
  CalendarBlank,
  CaretDown,
} from "@phosphor-icons/react";

export interface TaskFormData {
  title: string;
  note?: string;
  date?: string;
}

interface AddTaskFormProps {
  onSubmit: (data: TaskFormData) => void;
}

export default function AddTaskForm({ onSubmit }: AddTaskFormProps) {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    onSubmit({
      title: title.trim(),
      note: note.trim() || undefined,
      date: date || undefined,
    });

    setTitle("");
    setNote("");
    setDate("");
    setShowDatePicker(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-[#e3dcf0] bg-surface focus-within:border-purple-primary transition-colors">
        <PencilSimple size={22} className="text-secondary shrink-0" />
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Task title *"
          required
          className="flex-1 bg-transparent text-sm sm:text-base text-primary placeholder:text-secondary outline-none font-normal"
        />
      </div>

      <div className="flex items-start gap-3 px-4 py-3.5 rounded-2xl border border-[#e3dcf0] bg-surface focus-within:border-purple-primary transition-colors">
        <Note size={22} className="text-secondary shrink-0 mt-0.5" />
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Note (optional)"
          rows={3}
          className="flex-1 bg-transparent text-sm sm:text-base text-primary placeholder:text-secondary outline-none font-normal resize-none"
        />
      </div>

      <div className="flex flex-col gap-2 rounded-2xl border border-[#ece6f6] bg-[#f8f6fc] p-3.5">
        <button
          type="button"
          onClick={() => setShowDatePicker(!showDatePicker)}
          className="flex items-center justify-between w-full text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <CalendarBlank size={22} className="text-secondary shrink-0" />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-primary">
                Task date (optional)
              </span>
              <span className="text-xs text-secondary font-normal">
                {date ? date : "When do you want to do this task?"}
              </span>
            </div>
          </div>
          <CaretDown
            size={18}
            className={`text-secondary transition-transform ${
              showDatePicker ? "rotate-180" : ""
            }`}
          />
        </button>

        {showDatePicker ? (
          <div className="flex flex-col gap-2 pt-2 border-t border-[#ece6f6]">
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="px-3 py-2 rounded-xl border border-[#e3dcf0] bg-surface text-sm text-primary outline-none focus:border-purple-primary font-normal"
            />
          </div>
        ) : null}
      </div>

      <button
        type="submit"
        className="flex items-center justify-center w-full py-4 px-6 rounded-2xl font-medium text-base sm:text-lg text-white bg-gradient-to-r from-[#8c71e6] to-[#a488f5] shadow-[0_8px_20px_rgba(140,113,230,0.35)] hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer"
      >
        Add Task
      </button>
    </form>
  );
}
