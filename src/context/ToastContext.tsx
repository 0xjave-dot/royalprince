import React, { createContext, useContext, useState, useEffect } from "react";

interface ToastContextType {
  pushToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const pushToast = (msg: string) => {
    setMessage(msg);
    setIsVisible(true);
  };

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [isVisible, message]);

  return (
    <ToastContext.Provider value={{ pushToast }}>
      {children}
      <div
        id="toast"
        className={`fixed top-[60px] left-1/2 -translate-x-1/2 bg-[#202020] text-white px-5 py-2.5 rounded-[20px] font-sans text-[13px] font-semibold z-[999] transition-all duration-300 pointer-events-none whitespace-nowrap shadow-lg ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-[20px]"
        }`}
      >
        {message}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
