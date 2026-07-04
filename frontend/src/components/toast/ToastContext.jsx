import { createContext, useContext, useState, useCallback } from "react";
import Toast from "./Toast";

const ToastContext = createContext(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info", duration = 3500) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast container — fixed top-right */}
      {toasts.length > 0 && (
        <div className="fixed top-4 right-4 z-9999 flex flex-col gap-2.5 pointer-events-none max-sm:top-3 max-sm:right-auto max-sm:left-1/2 max-sm:-translate-x-1/2">
          {toasts.map((t) => (
            <div key={t.id} className="pointer-events-auto">
              <Toast
                id={t.id}
                message={t.message}
                type={t.type}
                duration={t.duration}
                onClose={removeToast}
              />
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}
