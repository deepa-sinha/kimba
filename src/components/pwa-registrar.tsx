"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { DownloadSimple, Sparkle, X } from "@phosphor-icons/react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function subscribeStandalone(callback: () => void) {
  const mediaQuery = window.matchMedia("(display-mode: standalone)");
  mediaQuery.addEventListener("change", callback);
  return () => {
    mediaQuery.removeEventListener("change", callback);
  };
}

function getStandaloneSnapshot() {
  const isMatchMedia = window.matchMedia("(display-mode: standalone)").matches;
  const isNavStandalone = (navigator as unknown as { standalone?: boolean }).standalone === true;
  return isMatchMedia || isNavStandalone;
}

function getStandaloneServerSnapshot() {
  return false;
}

export default function PwaRegistrar() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const isStandalone = useSyncExternalStore(
    subscribeStandalone,
    getStandaloneSnapshot,
    getStandaloneServerSnapshot
  );

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setInstallPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) {
      return;
    }

    await installPrompt.prompt();
    const result = await installPrompt.userChoice;
    if (result.outcome === "accepted") {
      setInstallPrompt(null);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  if (!installPrompt || isDismissed || isStandalone) {
    return null;
  }

  return (
    <aside
      aria-label="Install App"
      className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md bg-surface border border-border-subtle shadow-card rounded-2xl p-3 flex items-center justify-between gap-3 text-primary animate-[drawer-fade-in_0.2s_ease-out]"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-surface-tint text-purple-primary shrink-0">
          <Sparkle size={18} weight="fill" />
        </div>
        <div className="flex flex-col min-w-0">
          <p className="text-xs font-semibold text-primary truncate leading-tight">
            Install Kimba
          </p>
          <p className="text-[11px] text-secondary truncate leading-tight">
            Install app for fast offline access
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={handleInstall}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-purple-primary text-white text-xs font-medium hover:bg-purple-hover transition-colors cursor-pointer"
        >
          <DownloadSimple size={13} weight="bold" />
          <span>Install</span>
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss banner"
          className="p-1 rounded-full text-secondary hover:text-primary transition-colors cursor-pointer"
        >
          <X size={15} />
        </button>
      </div>
    </aside>
  );
}
