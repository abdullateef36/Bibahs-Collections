"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type NotificationTone = "info" | "success" | "error";

interface Notification {
  message: string;
  tone?: NotificationTone;
}

interface NotificationContextType {
  current: Notification | null;
  notify: (message: string, tone?: NotificationTone) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<Notification | null>(null);

  const notify = (message: string, tone: NotificationTone = "info") => {
    setCurrent({ message, tone });
  };

  useEffect(() => {
    if (!current) return;
    const timer = setTimeout(() => setCurrent(null), 1800);
    return () => clearTimeout(timer);
  }, [current]);

  return (
    <NotificationContext.Provider value={{ current, notify }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
}
