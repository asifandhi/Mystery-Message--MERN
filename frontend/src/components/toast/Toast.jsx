import { useState, useEffect, useCallback } from "react";

const ICONS = {
  success: "✓",
  error: "✕",
  warning: "!",
  info: "i",
};

const ICON_BG = {
  success: "bg-[#34c759]",
  error: "bg-[#ff3b30]",
  warning: "bg-[#ff9f0a]",
  info: "bg-[#007aff]",
};

const PROGRESS_BG = {
  success: "bg-[#34c759]",
  error: "bg-[#ff3b30]",
  warning: "bg-[#ff9f0a]",
  info: "bg-[#007aff]",
};

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    setIsMobile(mq.matches);
    return () => mq.removeEventListener("change", handler);
  }, [breakpoint]);

  return isMobile;
}

export default function Toast({ id, message, type = "info", duration = 3500, onClose }) {
  const [exiting, setExiting] = useState(false);
  const [paused, setPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const isMobile = useIsMobile();

  const dismiss = useCallback(() => {
    setExiting(true);
    setTimeout(() => onClose(id), 300);
  }, [id, onClose]);

  // Auto-dismiss timer that respects pause
  useEffect(() => {
    if (paused || exiting) return;

    setStartTime(Date.now());

    const remaining = duration - elapsed;
    if (remaining <= 0) {
      dismiss();
      return;
    }

    const timer = setTimeout(() => {
      dismiss();
    }, remaining);

    return () => clearTimeout(timer);
  }, [paused, exiting, duration, elapsed, dismiss]);

  const handleMouseEnter = () => {
    setPaused(true);
    setElapsed((prev) => prev + (Date.now() - startTime));
  };

  const handleMouseLeave = () => {
    setPaused(false);
  };

  // Calculate remaining ratio for progress bar
  const progressDuration = duration - elapsed;

  // Pick animation based on screen size
  const animIn = isMobile ? "animate-toast-in-top" : "animate-toast-in";
  const animOut = isMobile ? "animate-toast-out-top" : "animate-toast-out";

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`
        relative flex items-start gap-3 min-w-[320px] max-w-[400px] px-4 py-3.5 rounded-2xl overflow-hidden cursor-default
        max-sm:min-w-[280px] max-sm:max-w-[320px]
        bg-white/72 backdrop-blur-[24px] backdrop-saturate-[180%]
        border border-black/6
        shadow-[0_8px_32px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)]
        dark:bg-[rgba(30,30,32,0.78)] dark:border-white/8
        dark:shadow-[0_8px_32px_rgba(0,0,0,0.32),0_2px_8px_rgba(0,0,0,0.2)]
        ${exiting ? animOut : animIn}
      `}
    >
      {/* Icon */}
      <span
        className={`
          shrink-0 w-5 h-5 mt-0.5 flex items-center justify-center rounded-full
          text-[0.65rem] font-bold text-white leading-none
          ${ICON_BG[type]}
        `}
      >
        {ICONS[type]}
      </span>

      {/* Message */}
      <p className="flex-1 min-w-0 text-[0.8125rem] leading-snug text-[#1c1c1e] dark:text-[#f5f5f7] break-words">
        {message}
      </p>

      {/* Close button */}
      <button
        onClick={dismiss}
        className="
          shrink-0 w-[22px] h-[22px] mt-0.5 flex items-center justify-center rounded-full
          bg-black/6 text-[#8e8e93] text-[0.6rem] leading-none
          hover:bg-black/12 hover:text-[#1c1c1e]
          dark:bg-white/8 dark:text-[#98989d]
          dark:hover:bg-white/16 dark:hover:text-[#f5f5f7]
          transition-all duration-150 cursor-pointer
        "
      >
        ✕
      </button>

      {/* Progress bar */}
      <div
        className={`absolute bottom-0 left-0 h-[2.5px] rounded-b-2xl ${PROGRESS_BG[type]}`}
        style={{
          animation: paused
            ? "none"
            : `toast-progress-shrink ${progressDuration}ms linear forwards`,
          animationPlayState: paused ? "paused" : "running",
          width: paused ? `${((duration - elapsed) / duration) * 100}%` : undefined,
        }}
      />
    </div>
  );
}
