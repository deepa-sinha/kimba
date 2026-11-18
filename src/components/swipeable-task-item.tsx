"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { CheckCircle, Circle, Trash } from "@phosphor-icons/react";

export interface TaskItem {
  id: string;
  title: string;
  note?: string;
  date?: string;
  completed: boolean;
}

interface SwipeableTaskItemProps {
  task: TaskItem;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

export default function SwipeableTaskItem({
  task,
  onToggle,
  onRemove,
}: SwipeableTaskItemProps) {
  const itemRef = useRef<HTMLLIElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const isInitializedRef = useRef(false);
  const isRemovingRef = useRef(false);
  const hasMovedRef = useRef(false);

  const [isActivating, setIsActivating] = useState(false);

  const commit = useCallback(() => {
    if (isRemovingRef.current) return;
    isRemovingRef.current = true;
    setIsActivating(false);

    const item = itemRef.current;
    if (!item) {
      onRemove(task.id);
      return;
    }

    const initialHeight = item.offsetHeight;
    const animation = item.animate(
      [
        { height: `${initialHeight}px`, opacity: 1 },
        { height: "0px", opacity: 0 },
      ],
      {
        duration: 250,
        easing: "cubic-bezier(0.2, 0, 0, 1)",
        fill: "forwards",
      }
    );

    animation.onfinish = () => {
      if (typeof window !== "undefined" && "GestureEvent" in window) {
        item.style.pointerEvents = "none";
        setTimeout(() => {
          onRemove(task.id);
        }, 80);
      } else {
        onRemove(task.id);
      }
    };
  }, [onRemove, task.id]);

  useEffect(() => {
    const track = trackRef.current;
    const content = contentRef.current;
    if (!track || !content) return;

    const centerTrack = () => {
      track.scrollLeft = track.clientWidth;
    };

    centerTrack();

    const resizeObserver = new ResizeObserver(() => {
      if (!isRemovingRef.current) {
        centerTrack();
      }
    });
    resizeObserver.observe(track);

    const observer = new IntersectionObserver(
      (entries) => {
        if (!isInitializedRef.current || isRemovingRef.current) return;
        const entry = entries[0];
        if (!entry) return;

        const offset = Math.abs(track.scrollLeft - track.clientWidth);
        if (offset < 10) {
          setIsActivating(false);
          return;
        }

        if (entry.intersectionRatio < 0.2) {
          commit();
          return;
        }

        setIsActivating(entry.intersectionRatio < 0.8);
      },
      {
        root: track,
        threshold: [0.2, 0.8],
      }
    );

    const frameId = requestAnimationFrame(() => {
      centerTrack();
      observer.observe(content);
      isInitializedRef.current = true;
    });

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      resizeObserver.disconnect();
    };
  }, [commit]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const track = trackRef.current;
    if (!track) return;

    const startX = event.clientX;
    const startScroll = track.scrollLeft;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const diff = moveEvent.clientX - startX;
      if (Math.abs(diff) > 5) {
        hasMovedRef.current = true;
      }
      track.scrollLeft = startScroll - diff;
    };

    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    if (Math.abs(track.scrollLeft - track.clientWidth) > 8) {
      hasMovedRef.current = true;
    }
  };

  const handleContentClick = () => {
    if (hasMovedRef.current) {
      hasMovedRef.current = false;
      return;
    }
    onToggle(task.id);
  };

  const handleCheckboxClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onToggle(task.id);
  };

  const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    commit();
  };

  return (
    <li
      ref={itemRef}
      className={`task-item ${isActivating ? "is-activating" : ""}`}
    >
      <div className="task-action-underlay" aria-hidden="true">
        <div className="task-action-side">
          <Trash size={20} weight="duotone" />
          <span>Delete</span>
        </div>
        <div className="task-action-side">
          <span>Delete</span>
          <Trash size={20} weight="duotone" />
        </div>
      </div>

      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="task-track"
      >
        <div className="task-spacer" aria-hidden="true" />

        <div
          ref={contentRef}
          onClick={handleContentClick}
          onPointerDown={handlePointerDown}
          className="task-content"
        >
          <button
            type="button"
            aria-label={
              task.completed
                ? `Mark "${task.title}" as incomplete`
                : `Mark "${task.title}" as completed`
            }
            onClick={handleCheckboxClick}
            className="flex items-center justify-center shrink-0 p-1 text-primary cursor-pointer"
          >
            {task.completed ? (
              <CheckCircle
                size={24}
                weight="fill"
                className="text-green-accent shrink-0"
              />
            ) : (
              <Circle size={24} className="text-border-ring shrink-0" />
            )}
          </button>

          <div className="flex flex-col flex-1 min-w-0">
            <span
              className={`text-sm sm:text-base font-normal truncate transition-colors duration-200 ${
                task.completed
                  ? "line-through text-secondary"
                  : "text-primary"
              }`}
            >
              {task.title}
            </span>
            {task.note ? (
              <span className="text-xs text-secondary truncate font-normal">
                {task.note}
              </span>
            ) : null}
          </div>

          <button
            type="button"
            aria-label={`Delete task: ${task.title}`}
            onClick={handleDeleteClick}
            className="task-delete-btn"
          >
            <Trash size={18} weight="regular" />
          </button>
        </div>

        <div className="task-spacer" aria-hidden="true" />
      </div>
    </li>
  );
}
