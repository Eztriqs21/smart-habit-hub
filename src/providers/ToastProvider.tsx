"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { X } from "lucide-react";

type ToastType = "default" | "success" | "error" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  action?: { label: string; onClick: () => void };
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (
    message: string,
    type?: ToastType,
    action?: { label: string; onClick: () => void }
  ) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType>({
  toasts: [],
  showToast: () => {},
  dismissToast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (
      message: string,
      type: ToastType = "default",
      action?: { label: string; onClick: () => void }
    ) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { id, message, type, action }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const typeStyles: Record<ToastType, string> = {
    default: "bg-surface border-border text-foreground",
    success: "bg-success-light border-success text-foreground",
    error: "bg-error-light border-error text-foreground",
    warning: "bg-warning-light border-warning text-foreground",
  };

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-[10px] border shadow-lg min-w-[280px] max-w-[380px] animate-in slide-in-from-bottom-2 fade-in duration-200",
              typeStyles[toast.type]
            )}
          >
            <span className="text-sm flex-1">{toast.message}</span>
            {toast.action && (
              <button
                onClick={toast.action.onClick}
                className="text-sm font-medium text-primary hover:underline shrink-0"
              >
                {toast.action.label}
              </button>
            )}
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-text-muted hover:text-text-secondary shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
