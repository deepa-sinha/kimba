"use client";

import { useEffect } from "react";
import { X } from "@phosphor-icons/react";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
}

export default function Drawer({
  isOpen,
  onClose,
  title,
  children,
}: DrawerProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex flex-col justify-end items-center"
    >
      <div
        onClick={onClose}
        className="fixed inset-0 drawer-backdrop transition-opacity"
      />

      <div className="relative z-10 flex flex-col w-full max-w-lg rounded-t-[32px] sm:rounded-t-[36px] px-6 pt-3 pb-8 drawer-panel shadow-2xl">
        <div className="w-12 h-1 rounded-full bg-[#b8a5e8] mx-auto mb-4" />

        <div className="flex items-center justify-between mb-4">
          {title ? (
            typeof title === "string" ? (
              <h2 className="text-xl sm:text-2xl font-medium text-primary">
                {title}
              </h2>
            ) : (
              <div>{title}</div>
            )
          ) : (
            <div />
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="flex items-center justify-center w-8 h-8 rounded-full bg-[#f4f0fa] text-primary hover:bg-[#eae3f5] transition-colors cursor-pointer"
          >
            <X size={18} weight="bold" />
          </button>
        </div>

        <div className="flex flex-col w-full">{children}</div>
      </div>
    </div>
  );
}
