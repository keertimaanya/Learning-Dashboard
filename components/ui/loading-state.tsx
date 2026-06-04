"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { SPRING_TRANSITION } from "@/lib/constants";

/**
 * LoadingState — Display while data is loading
 *
 * FEATURES:
 * - Shows loading message
 * - After timeout (10s default), shows "taking longer" message
 * - Animated spinner
 * - Optional timeout countdown
 *
 * USAGE:
 * - Use with skeleton loading when possible
 * - Show this when loading takes > 5s
 */
export function LoadingState({
  message = "Loading...",
  timeoutMessage = "This is taking longer than usual...",
  timeoutDuration = 10000, // 10 seconds
  showTimeout = true,
}: {
  message?: string;
  timeoutMessage?: string;
  timeoutDuration?: number;
  showTimeout?: boolean;
}) {
  const [hasExceededTimeout, setHasExceededTimeout] = useState(false);

  useEffect(() => {
    if (!showTimeout) return;

    const timer = setTimeout(() => {
      setHasExceededTimeout(true);
    }, timeoutDuration);

    return () => clearTimeout(timer);
  }, [timeoutDuration, showTimeout]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={SPRING_TRANSITION}
      className="flex flex-col items-center justify-center rounded-2xl border border-surface-border bg-background-card p-12"
    >
      {/* Spinner */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="mb-4 h-8 w-8 rounded-full border-2 border-surface border-t-accent"
      />

      {/* Message */}
      <p className="text-sm text-text-muted mb-2">{message}</p>

      {/* Timeout Message */}
      {hasExceededTimeout && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-text-muted italic"
        >
          {timeoutMessage}
        </motion.p>
      )}
    </motion.div>
  );
}
